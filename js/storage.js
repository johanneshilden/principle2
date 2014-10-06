var Storage = (function($){

    function request(conf) {
        var res  = conf.resource.replace(/^\/|\/$/g, ''),
            host = $(document.body).data('host').replace(/\/$/, ''),
            data = conf.data ? serial(conf.data) : '',
            hash = CryptoJS.HmacSHA1(data, $(document.body).data('key'));

        delete(conf.data);
        $.support.cors = true;

        $.ajax($.extend({
            type         : 'GET',
            url          : host + '/' + res,
            cache        : false,
            data         : data,
            crossDomain  : true,
            dataType     : 'json',
            headers: {
                "Accept"       : "application/json; charset=utf-8",
                "Content-Type" : "application/json; charset=utf-8",
                "API-Access"   : "generic:" + hash.toString()
             }
        }, conf));
    }

    function serial(data) {
        return 'string' === typeof(data) ? data : JSON.stringify(data);
    }

    function load(resources, conf, pass) {

        if ('string' === typeof(resources)) {
            resources = {
                resource: {
                    type     : 'GET',
                    resource : resources
                }
            };
            conf = { success: function() {} };
        }

        var user = App.getUser();

        if (!pass) {
            if (user) {
                pass = user.password;
            } else {
                App.login();
                return;
            }
        }

        var n = 0, 
            errors = [],
            result = {};

        var conf = $.extend({
            error: function(errors) {
                if (_.all(errors, function(e) { return e.status; })) {
                    // All requests responded with a status.
                    App.error();
                } else {
                    App.offline();
                }
                _.each(errors, function(e) {
                    App.notify(e.message);
                });
            }
        }, conf);

        var hits = 0;

        var onComplete = function(hit) {
            if (hit) hits += 1;
            if (++n == Object.keys(resources).length) {
                if (!errors.length && conf.success) {
                    conf.success(result, hits);
                } else {
                    conf.error(errors);
                }
            }
        };

        for (key in resources) {

            var req = resources[key],
                item = 'sdrp.db.' + (user ? user.id + '.' : '')
                                  + (req.key || req.resource),
                cipher = store.get(item);

            if (cipher) { // Cache hit!
                var msg = CryptoJS.AES.decrypt(cipher, pass),
                    obj = JSON.parse(msg.toString(CryptoJS.enc.Utf8));
                result[key] = obj;
                onComplete(true);
            } else {
                if (App.onRequestBegin) {
                    App.onRequestBegin();
                }
                request($.extend(req, {
                    // Binding is essential here, since we are dealing with async 
                    // callbacks and destructive (evil) assignment.
                    success: function(key, item, response) {
                        result[key] = response;
                        var cipher = CryptoJS.AES.encrypt(JSON.stringify(response), pass);
                        // Store the encrypted response.
                        store.set(item, cipher.toString());
                    }.bind(this, key, item),
                    error: function(req, e) {
                        var obj = e.responseJSON;
                        if (obj && obj.message) {
                            errors.push({
                                status  : e.status,
                                message : req.resource + ': ' + obj.message
                            });
                        } else if (!e.status) {
                            errors.push({
                                message : 'No service.'
                            });
                        } else {
                            errors.push({
                                status  : e.status,
                                message : e.responseText
                            });
                        }
                    }.bind(this, req),
                    complete: function() { 
                        onComplete(false); 
                        if (App.onRequestComplete) {
                            App.onRequestComplete();
                        }
                    }
                }));
            }

        }
    }

    function process(req) {
        var success = req.success;
        delete(req.success);
        request($.extend({
            success: function(resp) {
                purge(req.purge);
                if (success && typeof success === "function") { 
                    success(resp); 
                }
            }, 
            error: function(e) {
                var obj = e.responseJSON;
                if (obj && obj.message) {
                    App.notify(errorMsg(req, obj.message, obj.error));
                } else if (!e.status) {
                    pushToQueue(req);
                    App.notify('Service unavailable. The request has been delayed.');
                } else {
                    App.notify(e.responseText);
                }
            },
        }, req));
    }

    function purge(key) {
        var user = App.getUser();
        if (user && key) {
            var item = 'sdrp.db.' + user.id + '.';
            if (key instanceof Array) {
                _.each(key, function(k) { store.remove(item + k); });
            } else {
                store.remove(item + key);
            }
        } 
    }

    function getQueue(user) {
        var user = user || App.getUser();
        var queue = [],
            cipher = store.get('sdrp.db.' + user.id + '._queue');
        if (cipher) {
            queue = JSON.parse(CryptoJS.AES.decrypt(cipher, user.password).toString(CryptoJS.enc.Latin1));
        }
        return queue;
    }

    function setQueue(user, queue) {
        var cipher = CryptoJS.AES.encrypt(JSON.stringify(queue), user.password);
        store.set('sdrp.db.' + user.id + '._queue', cipher.toString());
    }

    function pushToQueue(item) {
        var user = App.getUser();
        if (user) {
            var queue = getQueue(user);
            queue.push(item);
            setQueue(user, queue);
        }
    }

    function removeFromQueue(index) {
        var user = App.getUser();
        if (user) {
            var queue = getQueue(user);
            queue.splice(index, 1);
            setQueue(user, queue);
        }
    }

    function processQueue(item, callback) {
        var queue = Storage.queue.get(),
            req = queue[item];

        request($.extend({
            success: function(resp) {
                purge(req.purge);
                Storage.queue.remove(item);
                App.notify('Request processed successfully.');
            },
            error: function(e) {
                var obj = e.responseJSON;
                if (obj && obj.message) {
                    Storage.queue.remove(item);
                    App.notify(errorMsg(req, obj.message, obj.error));
                } else if (!e.status) {
                    App.notify('Service unavailable.');
                } else {
                    App.notify(e.responseText);
                }
            },
            complete: function() {
                if (callback && typeof callback === "function") { 
                    callback(); 
                }
            }
        }, req));
    }

    function errorMsg(req, message, error) {
        var readable = message;
        if (req.feedback && error in req.feedback) {
            readable = req.feedback[error];
        }
        return (req.hint ? req.hint + readable : readable);
    }
 
    // ~ public
    return {
        request         : request,
        load            : load,
        process         : process,
        purge           : purge,
        queue           : {
            get     : getQueue,
            push    : pushToQueue,
            remove  : removeFromQueue,
            process : processQueue
        },
        insert: function(key, val) {
            var user = App.getUser();
            if (user) {
                var item = 'sdrp.db.' + user.id + '.' + key;
                var cipher = CryptoJS.AES.encrypt(JSON.stringify(val), user.password);
                store.set(item, cipher.toString());
            }
        }
    };

}(jQuery));

var App = (function(){

    var router;
    var user;

    // ~ public
    return {
        getUser: function() { return user; },

        notify  : function(msg) { if (router.notify  && 'function' === typeof router.notify)  { router.notify(msg); } },
        login   : function()    { if (router.login   && 'function' === typeof router.login)   { router.login();     } },
        offline : function()    { if (router.offline && 'function' === typeof router.offline) { router.offline();   } },
        error   : function()    { if (router.error   && 'function' === typeof router.error)   { router.error();     } },
        onRequestBegin    : function() { if (router.onRequestBegin    && 'function' === typeof router.onRequestBegin)    { router.onRequestBegin();    } },
        onRequestComplete : function() { if (router.onRequestComplete && 'function' === typeof router.onRequestComplete) { router.onRequestComplete(); } },

        logout: function() {
            user = null;
            App.notify('User logged out.');
            window.location.hash = '';
        },

        authenticate: function(req) {
            var hash = req.hash;
            delete(req.hash);
            try {
                Storage.load({ user: req }, {
                    success: function(resp) {
                        user = resp.user;
                        App.notify('User authenticated.');
                        // Refresh the current route.
                        Backbone.history.stop(); 
                        Backbone.history.start();
                    },
                    error: function(e) {
                        var error = e[0];
                        if (!error.status) {
                            App.offline();
                        } else {
                            if (req.failure) {
                                req.failure();
                            }
                        }
                    }
                }, hash);
            } catch(e) {
                if (req.failure) {
                    req.failure();
                }
            }
        },

        init: function(routes) {
            var app = Backbone.Router.extend($.extend(routes, {
                execute: function(callback, args) {
                    var route = Backbone.history.fragment;
                    if (!App.getUser()) { 
                        App.login(); 
                        return;
                    }
                    if (callback) callback.apply(this, args);
                }
            }));
            router = new app();
            Backbone.history.start();
        },

        listen: function(conf) {

            var ws = new SockJS(conf.url), 
                client = Stomp.over(ws);
    
            // Heartbeats won't work with SockJS.
            client.heartbeat.outgoing = 0;
            client.heartbeat.incoming = 0;

            var onConnect = function() {
                client.subscribe('/exchange/trombone/api', function(msg) {

                    // Response to resource change notifications.
                    var items  = msg.body.split(' '),
                        method = items[0],
                        uri    = items[1];
            
                    for (key in conf.map) {
                        var matcher = routeMatcher(key),
                            res = matcher.parse(uri);
                        if (res) {
                            conf.map[key](res, method);
                            return;
                        }
                    }

                });
            };

            var onError = function() {
                console.log('Error connecting to AMQP service.');
            };
    
            client.connect(conf.user, conf.pass, onConnect, onError, '/');

        },

        refresh: function() {
            // Refresh the current route.
            Backbone.history.stop(); 
            Backbone.history.start();
        }

    };

}());
