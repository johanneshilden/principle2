(function(){

    Client.init({
        onConnect: function() {
            $('#client-mode').html('Connected: ' + (!Client.offline));
        },
        onDisconnect: function() {
            $('#client-mode').html('Connected: ' + (!Client.offline));
        },
        cachePolicy: 'none', // 'replace',
        offlineHandler: function() {
            window.location.hash = 'offline'; 
        }
    });

    var app = Backbone.Router.extend({
        routes: {
            ""                                      : "index",
            "orders/queued"                         : "showQueuedOrders",
            "orders/dispatched"                     : "showDispatchedOrders",
            "drivers"                               : "showDrivers",
            "stock/add"                             : "addStock",
            "stock/report-damage"                   : "reportStockDamage",
            "stock/summary"                         : "showStockSummary",
            "login"                                 : "login",
            "offline"                               : "offline"
        },
        index: function() {
            $('#main').empty();
        },
        offline: function() {
            $('#main').empty().template('offline');
        },
        login: function() {

            $('#main').empty();

            var form = $('<form></form>');
            $('#main').append(form);

            form.template0('login', function() {
                this.validate({
                    rules: {
                        user:     "required",
                        password: "required"
                    },
                    submitHandler: function(form) {
                        var login = $(form).serializeObject();
                        Client.connect(login.user, login.password, {
                            role: 'depot-manager',
                            success: function(res) {
                                Client.notify(res.username + ' logged in.');

                                $('body').append('You are now operating in depot #' + res.depotId);

                                window.location.hash = 'customer';
                            },
                            error: function(e) {
                                if (e.status) {
                                    Client.notify('Authentication failed.');
                                }
                            }
                        });
                    }
                });
            });

        },
        showQueuedOrders: function() {
            $('#main').empty().template('order/index', 'order/status/queued');
        },
        showDispatchedOrders: function() {
            $('#main').empty().template('order/index', 'order/status/dispatched');
        },
        showDrivers: function() {
            $('#main').empty().template('driver/index', 'user/role/driver');
        },
        addStock: function() {
            $('#main').empty();
        },
        reportDamagedStock: function() {
            $('#main').empty();
        },
        showStockSummary: function() {
            Proxy.load('depot/user/' + Client.id, {
                success: function(res) {
                    var depotId = res.depotId;
                    $('#main').empty().template('stock/summary', 'stock/depot/' + depotId);
                }
            });
        }
    });

    new app();
    Backbone.history.start();

}());

