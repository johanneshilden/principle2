var Storage = (function($){

    var passiveMode = false;

    /*
     * Look up a key owned by the current user in the device storage.
     */
    function lookup(key) {

        var user = App.user();

        if (!user) {
            App.login();
            return;
        } 

        var item = namespace(user.id) + key,
            cipher = store.get(item);

        if (!cipher) {
            return null;
        }

        var msg = CryptoJS.AES.decrypt(cipher, user.password);
        return JSON.parse(msg.toString(CryptoJS.enc.Utf8));

    }
    
    /*
     * Insert an object into the current user's local storage space.
     */
    function insert(key, val) {

        var user = App.user();

        if (!user) {
            App.login();
            return;
        } 

        var cipher = CryptoJS.AES.encrypt(JSON.stringify(val), user.password);
        store.set(namespace(user.id) + key, cipher.toString());

    }

    /*
     * Remove one or more keys from the current user's local storage space.
     */
    function purge(key) {

        var user = App.user();

        if (!user) {
            App.login();
            return;
        } 

        var ns = namespace(user.id);
        if (key instanceof Array) {
            _.each(key, function(i) { 
                store.remove(ns + i); 
            });
        } else {
            store.remove(ns + key);
        }

    }

    /*
     * Remove one or more keys from the storage spaces of every user.
     */
    function purgeAll(key) {
        if (key instanceof Array) {
            _.each(key, function(k) { 
                purgeAll(k);
            });
         } else {
            store.forEach(function(item) {
                if (key === _.last(item.split('.'))) {
                    store.remove(item);
                }
            });
        }
    }

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

    /*
     * Acquire a resource, either from the remote service, or from the device 
     * cache, depending on connectivity status and service availability.
     *
     * This method provides two different modes of operation: In passive mode,
     * no request will be made if a cached version of the resource is available 
     * on the local device. (Default is false, i.e., resources are always
     * fetched remotely when doing so is possible.)
     */
    function load(resource, key, callback, decorator, passive) {

        if (typeof passive === 'undefined') {
            passive = passiveMode;
        }

        var lookupKey = function() {
            var item = Storage.lookup(key);
            if (item) {
                if (callback && 'function' === typeof callback) {
                    callback(item);
                }
                return true;
            }
            return false;
        };

        if (passive === true && lookupKey()) {
            return;
        }

        App.onRequestBegin();

        if ('object' === typeof resource) {
            var result = {};
            var traverse = function(obj) {
                if (_.isEmpty(obj)) {
                    if (decorator) {
                        result = decorator(result);
                    }
                    if (callback && 'function' === typeof callback) {
                        if (false !== callback(result)) {
                            Storage.insert(key, result);
                        }
                    }
                    App.onRequestEnd();
                } else {
                    var res = _.keys(obj)[0],
                        val = obj[res];
                    delete obj[res];

                    Storage.request({
                        resource: val,
                        success: function(resp) {
                            result[res] = resp;
                            traverse(obj);
                        },
                        error: function(e) {
                            if (!e.status) {
                                if (passive !== true && lookupKey()) {
                                    return;
                                }
                                App.offline();
                            } else {
                                App.error(e);
                            }
                        }
                    });

                }
            };
            return traverse(resource);
        }
 
        Storage.request({
            resource: resource,
            success: function(resp) {
                if (decorator) {
                    resp = decorator(resp);
                }
                if (callback && 'function' === typeof callback) {
                    if (false !== callback(resp)) {
                        Storage.insert(key, resp);
                    }
                }
            },
            error: function(e) {
                if (!e.status) {
                    if (passive !== true && lookupKey()) {
                        return;
                    }
                    App.offline();
                } else {
                    App.error(e);
                }
            },
            complete: function() {
                App.onRequestEnd();
            }
        });

    }

    function collection(resource, key, callback) {
        load(resource, key, callback, function(resp) {
            return toMap(resp);
        });
    }

    function process(req) {

        var success = req.success;
        delete(req.success);

        request($.extend({
            success: function(resp) {
                if (req.purge) {
                    purgeAll(req.purge);
                }
                if (success && typeof success === "function") { 
                    success(resp); 
                }
                if (req.successMsg) {
                    App.notify(req.successMsg);
                }
            }, 
            error: function(e) {
                var obj = e.responseJSON;
                if (obj && obj.message) {
                    App.notify(errorMsg(req, obj.message, obj.error), 'error');
                } else if (!e.status) {
                    Storage.queue.push(req);
                    App.notify('Service unavailable. The request has been delayed.', 'important');
                } else {
                    App.notify(e.responseText, 'error');
                }
            },
        }, req));

    }

    /*
     * Translate an array of objects (of the same type) to a key-value object 
     * indexed over the provided key. If no key is specified, 'id' is assumed.
     */
    function toMap(item, key) {
        key = (typeof key === 'undefined') ? 'id' : key;
        var collection = {};
        _.each(item, function(i) {
            collection[i[key]] = i;
        });
        return collection;
    }

    function find(key, map, onFound) {
        var item = map[key];
        if (item) {
            if (onFound && typeof onFound === "function") { 
                onFound(item); 
            } 
            return item;
        } else {
            App.error({
                responseJSON: { message: 'Resource not found (Error 404).' }
            });
        }
        return null;
    }

    function chain(fs) {
        if (typeof fs === 'function') {
            fs = [fs];
        }
        return {
            chain: function(f) {
                fs.push(f);
                return chain(fs);
            },
            using: function(f) {
                run(fs, f);
            }
        };
    }

    function run(funs, done, args) {
        args = (typeof args === 'undefined') ? [] : args;
        if (funs.length) {
            funs[0](function(x) {
                args.push(x);
                run(_.tail(funs), done, args);
            });
        } else {
            done.apply(null, args);
        }
    }

    function errorMsg(req, message, error) {
        var readable = message;
        if (req.feedback && error in req.feedback) {
            readable = req.feedback[error];
        }
        return (req.hint ? req.hint + readable : readable);
    }
 
    function namespace(uid) {
        return App.ns() + '.db.' + uid + '.';
    }

    function serial(data) {
        return 'string' === typeof(data) ? data : JSON.stringify(data);
    }

    function fromCamel(str) {
        return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
    }

    function setPassiveMode(mode) {
        passiveMode = mode;
    }

    var queue = {

        push: function(request) {
            var queue = Storage.queue.get();
            queue[++queue.last] = request;
            Storage.insert('_queue', queue);
        },

        process: function(key, callback) {

            var queue = Storage.queue.get();
            if (queue.hasOwnProperty(key) && 'last' != key) {

                var req = queue[key];

                request($.extend({
                    success: function(resp) {
                        if (req.purge) {
                            purgeAll(req.purge);
                        }
                        Storage.queue.remove(key);
                        App.notify('Request processed successfully' + (req.successMsg ? (': ' + req.successMsg) : '.'));
                    },
                    error: function(e) {
                        var obj = e.responseJSON;
                        if (obj && obj.message) {
                            Storage.queue.remove(key);
                            App.notify(errorMsg(req, obj.message, obj.error), 'error');
                        } else if (!e.status) {
                            App.notify('Service unavailable.', 'error');
                        } else {
                            App.notify(e.responseText, 'error');
                        }
                    },
                    complete: function() {
                        if (callback && typeof callback === "function") { 
                            callback(); 
                        }
                    }
                }, req));

            }

        },

        remove: function(key) {
            var queue = Storage.queue.get();
            if (queue.hasOwnProperty(key) && 'last' != key) {
                delete queue[key];
                Storage.insert('_queue', queue);
            }
        },

        get: function() {
            var queue = Storage.lookup('_queue');
            if (!queue) {
                queue = {
                    last: 0
                }
            }
            return queue;
        }

    };

    // ~ public
    return {
        lookup         : lookup,
        insert         : insert,
        purge          : purge,
        purgeAll       : purgeAll,
        request        : request,
        load           : load,
        collection     : collection,
        process        : process,
        toMap          : toMap,
        find           : find,
        chain          : chain,
        setPassiveMode : setPassiveMode,
        queue          : queue
    };
 
}(jQuery));

var App = (function(){

    var router;
    var user;
    var namespace;

    return {

        init: function(routes) {
            var app = Backbone.Router.extend($.extend(routes, {
                execute: function(callback, args) {
                    var route = Backbone.history.fragment;
                    if (!App.user()) { 
                        App.login(); 
                        return;
                    }
                    if (callback) callback.apply(this, args);
                }
            }));
            namespace = routes.namespace || 'appcache';
            router = new app();
            Backbone.history.start();
        },

        user: function() { return user; },
    
        notify: function(msg, type) {
            var types = ['notice', 'error', 'important', 'warning'];
            if (!type || !_.contains(types, type)) {
                type = 'notice';
            }
            if (router.notify && 'function' === typeof router.notify) { 
                router.notify(msg, type); 
            } 
        },
    
        login: function() {
            if (router.login && 'function' === typeof router.login) { 
                router.login(); 
            } 
        },

        offline: function() {
            if (router.offline && 'function' === typeof router.offline) { 
                router.offline(); 
            } 
        },
     
        error: function(e) {
            if (router.error && 'function' === typeof router.error) { 
                router.error(e); 
            } 
        },

        onRequestBegin: function() {
            if (router.onRequestBegin && 'function' === typeof router.onRequestBegin) { 
                router.onRequestBegin(); 
            } 
        },

        onRequestEnd: function() {
            if (router.onRequestEnd && 'function' === typeof router.onRequestEnd) { 
                router.onRequestEnd(); 
            } 
        },
    
        logout: function() {
            user = null;
            App.notify('User logged out.');
            window.location.hash = '';
        },
    
        listen: function(conf) {

            var ws = new SockJS(conf.url), 
                client = Stomp.over(ws);
    
            // Heartbeats won't work with SockJS.
            client.heartbeat.outgoing = 0;
            client.heartbeat.incoming = 0;

            var onConnect = function() {
                client.subscribe('/exchange/trombone/api', function(msg) {

                    // Respond to resource change notifications.
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

                    console.log('Unhandled resource notification message: ' + uri);

                });
            };

            var onError = function() {
                console.log('Error connecting to AMQP service.');
            };
    
            client.connect(conf.user, conf.pass, onConnect, onError, '/');

        },

        authenticate: function(username, pass, uri) {

            var local = store.get(App.ns() + '.db.user/' + username);

            if (local) {
                try {
                    var msg = CryptoJS.AES.decrypt(local, pass);
                    user = JSON.parse(msg.toString(CryptoJS.enc.Utf8));
                    App.notify('User ' + username + ' authenticated.');
                    App.refresh();
                } catch(e) {
                    App.notify('Authentication failed.', 'error');
                }
            } else {
                if (!uri) {
                    // Default server resource: user/:user/:pass
                    uri = 'user/' + username + '/' + pass;
                }
                Storage.request({
                    resource: uri,
                    success: function(resp) {
                        user = resp;
                        var cipher = CryptoJS.AES.encrypt(JSON.stringify(user), user.password);
                        store.set(App.ns() + '.db.user/' + username, cipher.toString());
                        App.notify('User ' + username + ' authenticated.');
                        App.refresh();
                    },
                    error: function(e) {
                        if (!e.status) {
                            App.offline();
                        } else {
                            App.notify('Authentication failed.', 'error');
                        }
                    }
                });
            }

        },
    
        refresh: function() {
            // Refresh the current route.
            Backbone.history.stop(); 
            Backbone.history.start();
        },

        ns: function() {
            return namespace;
        }

    };

}());

