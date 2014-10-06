var App = (function(){

    var router;
    var user;

    return {

        getUser: function() { return user; },

        notify:  function(msg) { if (router.notify  && 'function' === typeof router.notify)  { router.notify(msg); } },
        login:   function()    { if (router.login   && 'function' === typeof router.login)   { router.login();     } },
        offline: function()    { if (router.offline && 'function' === typeof router.offline) { router.offline();   } },
        error:   function()    { if (router.error   && 'function' === typeof router.error)   { router.error();     } },

        authenticate: function(req) {
            try {
                Storage.load({ user: req }, {
                    success: function(resp) {
                        user = resp.user;
                        notify('User authenticated.');
                        if (req.success) {
                            req.success();
                        } else {
                            // Refresh the current route.
                            Backbone.history.stop(); 
                            Backbone.history.start();
                        }
                    },
                    error: function(e) {
                        var error = e[0];
                        if (!error.status) {
                            offline();
                        } else {
                            if (req.failure) {
                                req.failure();
                            }
                        }
                    }
                }, req.hash);
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
                    if (!getUser()) { 
                        login(); 
                        return;
                    }
                    if (callback) callback.apply(this, args);
                }
            }));
            router = new app();
            Backbone.history.start();
        }

    };

}());
