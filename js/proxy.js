window.Proxy = {

    /*
     ( Local storage name prefix 
     */
    namespace: 'sdrp.db',

    /*
     ( Caching policy: Should be either 'replace' or 'purge'.
     */
    policy: 'replace',

    /*
     ( Delayed response hooks.
     */
    delayedSuccess: null, delayedError: null,

    /*
     ( Connect to RabbitMQ service using Web-Stomp and SockJS.
     */
    connectAMQP: function(conf) {
        var ws = new SockJS(conf.uri),
            client = Stomp.over(ws);

        // Heartbeats won't work with SockJS.
        client.heartbeat.outgoing = 0;
        client.heartbeat.incoming = 0;

        var onConnect = function() {
            client.subscribe(conf.dest, function(d) {
                var resource = d.body;
                while (resource) {
                    store.remove(Proxy.namespace + '.' + resource);
                    Proxy.log('Purging cache entry with key: ' + resource);
                    if (Proxy.policy == 'replace') {
                        Proxy.get(resource);
                    } 
                    var lof = resource.lastIndexOf('/');
                    resource = resource.slice(0, lof == -1 ? 0 : lof);
                }
            });
            if (conf.onConnect) {
                conf.onConnect(client);
            }
        };
        var onError = function() {
            Proxy.log('Error connecting to AMQP service.');
        };

        client.connect(conf.uname, conf.pass, onConnect, onError, '/');
    },

    /*
     ( Initialize the proxy.
     (
     ( -----------------------------------------------------------
     ( - Required configuration keys:
     (
     (     uri      : Host (e.g. http://127.0.0.1:55674/stomp)
     (     dest     : AMQP destination (e.g. an exchange or topic)
     (     uname    : Username
     (     pass     : Password
     (
     ( -----------------------------------------------------------
     ( - Optional:
     (
     (     interval       : Worker interval (default is 4 sec)
     (     delayedSuccess : Callback used when a queued request is successful
     (     delayedError   : Queued request failed
     (     onConnect      : Triggered when connection is established
     */
    init: function(conf) {
        Proxy.delayedSuccess = conf.delayedSuccess;
        Proxy.delayedError = conf.delayedError;

        var client = Proxy.connectAMQP(conf);

        setInterval(Proxy.dequeue, conf.interval || 4000);
    },

    /*
     ( Obtain a resource from the proxy, or request it from the 
     ( server if the resource is not cached and the device is 
     ( in a connected state.
     (
     ( -----------------------------------------------------------
     ( - Optional configuration keys:
     ( 
     (     success : Invoked when data is available 
     (     error   : Error handler
     */
    get: function(resource, conf) {
        // Normalize the resource name
        var res  = resource.replace(/^\/|\/$/g, ''),
            obj  = store.get(Proxy.namespace + '.' + res),
            conf = conf || {};

        if (null == obj) {
            // Try to acquire the resource from server
            Datasource.fetch({
                resource: res,
                success: function(obj) {
                    Proxy.log('Inserting entry ' + res + ' into cache.');
                    store.set(Proxy.namespace + '.' + res, JSON.stringify(obj));
                    if (conf.success) {
                        conf.success(obj);
                    }
                }, 
                error: function(e) {
                    if (!e.status) {
                        // Connection failed
                        Proxy.log('Service unavailable.');
                    }
                    if (conf.error) {
                        conf.error(e);
                    }
                }
            });
        } else {
            if (conf.success) {
                conf.success(JSON.parse(obj));
                Proxy.log('(cache hit)');
            }
        }
    },

    /*
     ( Write data to proxy. This procedure will first attempt to
     ( send the request to the server. If the service is currently
     ( unavailable, the request is instead queued and processed
     ( in due time by the worker.
     (
     ( -----------------------------------------------------------
     ( - Optional configuration keys:
     ( 
     (     success        : Invoked when data was written to server
     (     error          : Error handler
     (     purge          : A resource that will be purged once the
     (                      operation is complete
     */
    send: function(verb, resource, data, conf) {
        // Normalize the resource name
        var res  = resource.replace(/^\/|\/$/g, '');

        Datasource.request({
            type: verb,
            resource: res,
            data: JSON.stringify(data),
            success: function() {
                if (conf.purge) { Proxy.purge(conf.purge); }
                if (conf.success) { conf.success(); }
            }, 
            error: function(e) {
                if (e.status) {
                    if (conf.error) { conf.error(e); }
                } else {
                    var key = Proxy.namespace + '_queue';
                    // Push object to request queue
                    var queue = store.get(key) || [];
                    queue.push([verb, res, JSON.stringify(data), conf.purge]);
                    store.set(key, queue);
                    // Invoke callback, if one was provided
                    if (conf.delayed) { conf.delayed() }
                }
            }
        });
    },

    /*
     ( Remove an existing key from the cache.
     */
    purge: function(key) {
        if (!key) return;
        store.remove(Proxy.namespace + '.' + key);
    },

    /*
     ( Process request queue.
     */
    dequeue: function() {
        var queue = store.get(Proxy.namespace + '_queue') || [];
        if (!queue || !queue.length) {
            console.log('Request queue is empty.');
            // Nothing to do right now
            return;
        }

        Proxy.log('Ping!');
        var host = $(document.body).data('host').replace(/\/$/, '');
        $.support.cors = true;
        $.ajax({
            type: 'GET',
            url: host + '/ping',
            data: '',
            cache: false,
            crossDomain: true,
            success: function() {
                // Service reachable: process the queue
                Proxy._dequeue();
            }
        });
    },

    _dequeue: function() {
        var key   = Proxy.namespace + '_queue',
            queue = store.get(key) || [];
        if (queue.length) {
            var head     = queue[0],
                method   = head[0],
                resource = head[1],
                payload  = head[2],
                purge    = head[3];

            // Update the queue
            store.set(key, queue.slice(1));

            Datasource.request({
                type: method,
                resource: resource,
                data: payload,
                success: function(o) {
                    if (purge) { Proxy.purge(purge); }
                    if (Proxy.delayedSuccess) { Proxy.delayedSuccess(o); }
                    Proxy._dequeue();
                }, 
                error: function(e) {
                    if (!e.status) {
                        // No response, try again later?
                        var queue = store.get(key) || [];
                        queue.push(head);
                        store.set(key, queue);
                        Proxy.log('Service unavailable.');
                    } else {
                        // The server responded with an error
                        if (Proxy.delayedError) { Proxy.delayedError(e); }
                        Proxy._dequeue();
                    }
                }
            });
        }
    },

    log: function(msg) {
        console.log(msg);
    }

};
