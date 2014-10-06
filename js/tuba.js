(function(){

    window.Datasource = {

        /*
         * User credentials in the format 'user:password', where it is
         * strongly recommended that passwords are hashed in advance 
         * by the client application.
         */
        identity: null,

        /*
         * Initiate a server request. This is an asynchronous ajax call,
         * unless otherwise specified.
         *
         * --------------------------------------------------------------
         * - Configuration keys:
         * 
         *    type     : HTTP method
         *    resource : Server resource
         *    data     : JSON request object
         * 
         * Any options accepted by $.ajax() may be supplied here.
         *
         */
        request: function(config) {
            $.support.cors = true;

            var data = config.data || '';

            if (typeof data === 'object') {
                data = JSON.stringify(data);
            }

            var hash = CryptoJS.HmacSHA1(data, $(document.body).data('key')),
                host = $(document.body).data('host').replace(/\/$/, ''),
                res  = config.resource.replace(/^\/|\/$/g, '');

            $.ajax($.extend(config, {
                type        : config.type || 'GET',
                url         : host + '/' + res,
                cache       : false,
                data        : data,
                crossDomain : true,
                dataType    : 'json',
                headers     : {
                    "Accept"       : "application/json; charset=utf-8",
                    "Content-Type" : "application/json; charset=utf-8",
                    "API-Access"   : "generic:" + hash.toString(),
                    "API-User"     : this.identity || 'guest:guest'
                }
            }));
        }
    };

    window.Proxy = {

        /*
         * Local storage name prefix.
         */
        namespace: 'sdrp.db',

        /*
         * Caching policy: Should be 'none', 'replace' or 'purge'.
         *
         * Default behavior is to replace an entry in the local cache, 
         * as soon as a resource changes on the server.
         */
        policy: 'replace',

        /*
         * Callback used to recover from failed connection attempts.
         */ 
        offlineHandler: null,

        /*
         * Obtain a resource from the proxy, or request it from the 
         * server if the resource is not cached and the device is 
         * connected.
         *
         * --------------------------------------------------------------
         * - Configuration keys:
         *
         *     success : Invoked when data is available 
         *     error   : Error handler
         *
         */
        load: function(resource, conf) {

            // Normalize the resource name
            var res  = resource.replace(/^\/|\/$/g, ''),
                obj  = store.get(this.namespace + '.' + res),
                conf = conf || {};

            if (null == obj || this.policy == 'none' || (conf.type && conf.type != 'GET')) {

                if (Client.offline) {
                    Client.notify('This resource is not available in offline mode.');
                    if (this.offlineHandler) {
                        this.offlineHandler();
                    }
                    return;
                }
                
                // Acquire the resource from server
                Datasource.request({
                    type: conf.type || 'GET',
                    data: conf.data || '',
                    resource: res,
                    success: _.bind(function(obj) {
                        if (this.policy != 'none') {
                            console.log('Writing ' + res + ' to cache.');
                            store.set(Proxy.namespace + '.' + res, JSON.stringify(obj));
                        }
                        if (conf.success) { conf.success(obj); }
                    }, this), 
                    error: _.bind(function(e) {
                        if (!e.status) {
                            // Connection failed (no response)
                            Client.goOffline('Service unavailable.');
                            if (this.offlineHandler) {
                                this.offlineHandler();
                            }
                        }
                        if (conf.error) { conf.error(e); }
                    }, this)
                });

            } else {
                // An item was found in the device local storage.
                if (conf.success) {
                    conf.success(JSON.parse(obj));
                    console.log('<Cache hit: ' + resource + '>');
                }
            }
        },

        /*
         * Write data to proxy. This method will first attempt to send 
         * the request to the server. If the service is unavailable, 
         * the request is instead queued and processed at a later time.
         *
         * --------------------------------------------------------------
         * - Configuration keys:
         *
         *     success       : Invoked when data was written to server
         *     error         : Error handler
         *     delayed       : Called when a request is pushed to the
         *                     offline queue
         *     complete      : Triggered both at 'success' and 'delayed'
         *     purge         : A resource that will be purged once the
         *                     operation is complete
         *
         */
        write: function(verb, resource, data, conf) {
            // Normalize the resource name
            var res = resource.replace(/^\/|\/$/g, '');

            if (Client.offline) {
                this.queueRequest(verb, res, data, conf);
                if (conf.delayed)  { conf.delayed(); }
                if (conf.complete) { conf.complete(); }
                return;
            }

            Datasource.request({
                type     : verb,
                resource : res,
                data     : JSON.stringify(data),
                success: _.bind(function(res) {
                    if (conf.purge)    { this.purge(conf.purge); }
                    if (conf.success)  { conf.success(res); }
                    if (conf.complete) { conf.complete(); }
                }, this), 
                error: _.bind(function(e) {
                    if (e.status) {
                        if (conf.error) { conf.error(e); }
                    } else {
                        Client.goOffline('Service unavailable.');
                        this.queueRequest(verb, res, data, conf);
                        // Invoke callback, if one was provided
                        if (conf.delayed)  { conf.delayed(); }
                        if (conf.complete) { conf.complete(); }
                    }
                }, this)
            });
        },

        /*
         * Add an item to request queue, to be processed once connectivity
         * is available.
         */
        queueRequest: function(verb, res, obj, conf) {
            var key = this.namespace + '_queue';
            // Push object to request queue
            var queue = store.get(key) || [];
            queue.push([verb, res, JSON.stringify(obj), conf.purge]);
            store.set(key, queue);
        },

        /*
         * Remove a key from the cache.
         */
        purge: function(key) {
            if (key) { store.remove(this.namespace + '.' + key); }
        },

        /*
         * Receive a change notification from server (via RabbitMQ).
         */
        receive: function(message) {
            var pieces = message.body.split(' ');
            var resource = pieces.length > 1 ? pieces[1] : null;
            while (resource) {
                // Strip off any leading '!' characters
                while(resource.charAt(0) === '!')
                    resource = resource.substr(1);
                store.remove(this.namespace + '.' + resource);
                console.log('<Purging: ' + resource + '>');
                if (this.policy == 'replace') {
                    this.load(resource);
                } 
                var lof = resource.lastIndexOf('/');
                resource = resource.slice(0, lof == -1 ? 0 : lof);
            }
        },

        dequeue: function() {
            var key   = this.namespace + '_queue', 
                queue = store.get(key) || [];

            if (queue.length) {
                var head     = queue[0],
                    method   = head[0],     // HTTP method
                    resource = head[1],     // resource name
                    payload  = head[2],     // JSON object
                    purge    = head[3];     // (optional) resource to purge, once finished
    
                // Update the queue
                store.set(key, queue.slice(1));

                Datasource.request({
                    type     : method,
                    resource : resource,
                    data     : payload,
                    success: _.bind(function(res) {
                        if (purge) { this.purge(purge); }
                        this.dequeue();
                    }, this), 
                    error: _.bind(function(e) {
                        if (!e.status) {
                            // Connection failed
                            var queue = store.get(key) || [];
                            queue.push(head);
                            store.set(key, queue);
                            Client.goOffline('Service unavailable.');
                        } else {
                            // The server responded with an error
                            this.dequeue();
                        }
                    }, this)
                });
            }

        }

    };

    window.Client = {

        _onConnect    : null,
        _onDisconnect : null,

        /*
         * Offline mode
         */
         offline: true,

        /*
         * The id of the active user, or null if none.
         */
        id: null,

        /*
         * Initialise the client.
         */
        init: function(conf) {
            var conf = conf || {};
            _onConnect    = conf.onConnect;
            _onDisconnect = conf.onDisconnect;
            uri           = conf.uri   || 'http://127.0.0.1:55674/stomp';
            dest          = conf.dest  || '/exchange/trombone/api';
            uname         = conf.uname || 'guest';
            pass          = conf.pass  || 'guest';
            Proxy.policy          = conf.cachePolicy || 'replace';
            Proxy.offlineHandler  = conf.offlineHandler;
        },

        getUserId: function() {
            if (Client.id) {
                return Client.id;
            } else {
                return store.get(Proxy.namespace + '_uid');
            }
        },

        /*
         * Move client to connected state.
         */
        connect: function(user, pass, conf) {
            var conf = conf || {},
                res  = conf.role || 'user';
            Datasource.identity = user + ':' + pass;
            Datasource.request({
                resource: res + '/' + user + '/' + pass,
                success: _.bind(function(res) {
                    this.id = res.id;
                    store.set(Proxy.namespace + '_uid', this.id);
                    this.offline = false;
                    this.initAmqp();
                    Proxy.dequeue();
                    if (conf.success) {
                        conf.success(res);
                    } else {
                        this.refresh();
                    }
                }, this),
                error: _.bind(function(e) {
                    Datasource.identity = null;
                    this.id = null;
                    if (!e.status) {
                        Client.notify('Service unavailable.');
                    } 
                    if (conf.error) { conf.error(e); }
                }, this)
            });
        },

        /*
         * Force client offline.
         */
        goOffline: function(reason) {
            this.offline = true;
            if (_onDisconnect) _onDisconnect();
            console.log(reason);
            this.refresh();
        },

        /*
         * Connect to RabbitMQ service.
         */
        initAmqp: function() {
            var ws = new SockJS(uri), client = Stomp.over(ws);
    
            // Heartbeats won't work with SockJS.
            client.heartbeat.outgoing = 0;
            client.heartbeat.incoming = 0;
    
            var onConnect = function() {
                client.subscribe(dest, function(msg) {
                    Proxy.receive(msg);
                });
                if (_onConnect) _onConnect();
            };
            var onError = function() {
                Client.goOffline('Error connecting to AMQP service.');
            };
    
            client.connect(uname, pass, onConnect, onError, '/');
        },

        /*
         * Notify the user of some change in application state.
         */
        notify: function(msg) {
            $('#notifications').prepend('<tr><td>' + msg + '<span style="float: right;"><a class="notification-close" href="javascript:">close</a></span></td></tr>');
        },

        /*
         * Refresh the current route.
         */
        refresh: function() {
            Backbone.history.stop(); 
            Backbone.history.start();
        }

    };

    /*
     * This decorates Handlebars.js with the ability to load
     * templates from an external source, with light caching.
     * 
     * To render a template, pass a closure that will receive the 
     * template as a function parameter, eg, 
     *   T.render('templateName', function(t) {
     *       $('#somediv').html( t() );
     *   });
     *
     * This script was created by Ted Pennings.
     * https://github.com/wycats/handlebars.js/issues/82#issuecomment-1512583
     */
    var Template = function() {
        this.cached = {};
    };
    window.T = new Template();
    $.extend(Template.prototype, {
        render: function(name, callback) {
            if (T.isCached(name)) {
                callback(T.cached[name]);
            } else {
                $.get(T.urlFor(name), function(raw) {
                    T.store(name, raw);
                    T.render(name, callback);
                });
            }
        },
        renderSync: function(name, callback) {
            if (!T.isCached(name)) {
                T.fetch(name);
            }
            T.render(name, callback);
        },
        prefetch: function(name) {
            $.get(T.urlFor(name), function(raw) { 
                T.store(name, raw);
            });
        },
        fetch: function(name) {
            // synchronous, for those times when you need it.
            if (!T.isCached(name)) {
                var raw = $.ajax({'url': T.urlFor(name), 'async': false}).responseText;
                T.store(name, raw);         
            }
        },
        isCached: function(name) {
            return !!T.cached[name];
        },
        store: function(name, raw) {
            T.cached[name] = Handlebars.compile(raw);
        },
        urlFor: function(name) {
            return "templates/" + name + ".handlebars";
        }
    });

    Handlebars.registerHelper('formatDate', function(d) {
        var dateObject = new Date(d.substring(0, 10) + 'T' + d.substring(11, 23));
        return dateObject.toString('M/d/yyyy hh:mm'); 
    });

})();

(function($){
    $.fn.tpl = function(response, template, config) { 
        if (typeof template === 'string') {
            template = Handlebars.compile($('#' + template).html());
        }
        this.html(template(response instanceof Array ? {result: response} : response));
        if (config && config.success) config.success(response);
        return this;
    };
    $.fn.render = function(resource, template, config) {
        Proxy.load(resource, $.extend(config, {
            success: _.bind(function(resp) { $(this).tpl(resp, template, config); }, this)
        }));
        return this;
    };
    $.fn.template = function(template, resource, yield) {
       if (!resource) {
            T.render(template, _.bind(function(t) {
                $(this).append($('<div></div>').tpl({}, t));
                if (yield) yield.call(this);
            }, this));               
        } else {
            Proxy.load(resource, {
                success: _.bind(function(resp) {
                    this.templateResult(template, resp, yield);
                }, this)
            });
        }
        return this;
    };
    $.fn.template0 = function(template, yield) {
        return this.template(template, null, yield);
    };
    $.fn.templateResult = function(template, result, yield) {
        T.render(template, _.bind(function(t) {
            $(this).append($('<div></div>').tpl(result, t));
            if (yield) yield.call(this);
        }, this));               
         return this;
    };
    $.fn.replaceResult = function(template, result, yield) {
        T.render(template, _.bind(function(t) {
            $(this).tpl(result, t);
            if (yield) yield.call(this);
        }, this));               
         return this;
    };

}(jQuery));
