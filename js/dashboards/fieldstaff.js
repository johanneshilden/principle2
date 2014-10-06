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
            window.location.hash = 'login'; 
        }
    });

    function uiState(s) {
        switch (s) {
            case 'customer':
                var ul = $('<ul class="tabs"></ul>');
                ul.replaceResult('fieldstaff/submenu', [
                    {
                        title : 'Assigned customers',
                        url   : 'customers',
                        css   : 'count',
                        attr  : [{
                            name: 'data-count',
                            value: 0
                        }]
                    },
                    {
                        title : 'Central database',
                        url   : 'customers/central'
                    },
                    {
                        title : 'Register customer',
                        url   : 'customers/add'
                    },
                    {
                        title : 'Pending confirmation',
                        url   : 'customers/pending'
                    }
                  ]);
                $('#main').empty().append(ul);

                var userId = Client.getUserId();
                if (userId) {
                    Proxy.load('customer/count/area/user/' + userId, {
                        success: function(resp) {
                            $('ul.tabs a[href="#customers"]').attr('data-count', resp.count);
                        }
                    });
                } else {
                    $('ul.tabs a[href="#customers"]').removeAttr('data-count');
                }
                break;
            case 'task':
                var ul = $('<ul class="tabs"></ul>');
                ul.replaceResult('fieldstaff/submenu', [
                    {
                        title : 'Live tasks',
                        url   : 'tasks'
                    },
                    {
                        title : 'New tasks',
                        url   : 'tasks/new'
                    }
                ]);
                $('#main').empty().append(ul);
                break;
            case 'performance':
                var ul = $('<ul class="tabs"></ul>');
                ul.replaceResult('fieldstaff/submenu', [
                    {
                        title : 'Today',
                        url   : 'performance'
                    },
                    {
                        title : 'Weekly',
                        url   : 'performance/weekly'
                    },
                    {
                        title : 'Monthly',
                        url   : 'performance/monthly'
                    }
                ]);
                $('#main').empty().append(ul);
                break;
            case 'no-sidebar':
            default:
                $('#main').empty();
            }
    }

    $('#notifications').delegate('.notification-close', 'click', function() {
        $(this).closest('tr').remove();
    });
   
    var app = Backbone.Router.extend({
        routes: {
            ""                         : "index",
            "login"                    : "login",
            "customers"                : "showCustomers",
            "customers/central"        : "showCentralCustomers",
            "customers/pending"        : "showPendingCustomers",
            "customers/add"            : "createCustomer",
            "customer/:id"             : "showCustomer",
            "orders"                   : "showOrders",
            "order/:id"                : "showOrder",
            "product/:id"              : "showProduct",
            "tasks"                    : "showTasks",
            "tasks/new"                : "showNewTasks",
            "stock"                    : "showStock",
            "performance"              : "showPerformance",
            "performance/weekly"       : "showWeeklyPerformance",
            "performance/monthly"      : "showMonthlyPerformance",
            "user"                     : "showUser"
        },
        index: function() {
            $('#main').empty();
        },
        showCustomers: function() {
            var userId = Client.getUserId();
            if (userId) {
                uiState('customer');
                $('#main').template('fieldstaff/customer/index', 'customer/area/user/' + userId, function() {
                    this.find('div').first().addClass('tabs');
                });
            } else {
                window.location.hash = 'login';
            }
        },
        showCentralCustomers: function() {
            uiState('customer');
            $('#main').template('fieldstaff/customer/index', 'customer', function() {
                this.find('div').first().addClass('tabs');
            });
        },
        showPendingCustomers: function() {
            uiState('customer');
            $('#main').template('fieldstaff/customer/index', 'customer/inactive', function() {
                this.find('div').first().addClass('tabs');
            });
        },
        createCustomer: function() {
            uiState('customer');
 
            var div = $('<div></div>');
            $('#main').append(div);

            div.template0('fieldstaff/customer/create', function() {

                this.find('div').first().addClass('tabs');

                var userId = Client.getUserId();
                if (userId) {

                    Proxy.load('area/fieldstaff/' + userId, {
                        success: function(resp) {
                            $('#area_id').replaceResult('fieldstaff/select-list', resp);
                        }
                    });

                    Proxy.load('price-category', {
                        success: function(resp) {
                            $('#price_cat_id').replaceResult('fieldstaff/select-list', resp);
                        }
                    });
    
                    var form = this.find('form').first();
                    form.validate({
                        rules: {
                            name      : "required",
                            latitude  : "required",
                            longitude : "required",
                            tin       : "required",
                            phone     : "required"
                        },
                        submitHandler: function(form) {
                            var customer = $(form).serializeObject();
    
                            console.log(customer);
    
                            Proxy.write('POST', 'customer', customer, {
                                complete: function() {
                                    window.location.hash = 'customers';
                                }
                            });
    
                        }
                    });

                } else {
                    window.location.hash = 'login';
                }

            });

        },
        showCustomer: function(id) {

            uiState('customer');
            $('#main').template('fieldstaff/customer/view', 'customer/' + id, function() {
                this.find('div').first().addClass('tabs');
            });

        },
        showOrders: function() {

            uiState('no-sidebar');
            $('#main').template('fieldstaff/order/index', 'order');

        },
        showOrder: function(id) {

            uiState('no-sidebar');

            var description = $('<div></div>');
            var products = $('<div></div>');

            $('#main').append(description);
            $('#main').append(products);

            description.template('fieldstaff/order/view', 'order/' + id);
            products.template('fieldstaff/order/products', 'product/order/' + id);

        },
        showProduct: function(id) {

            uiState('no-sidebar');
            $('#main').template('fieldstaff/product/view', 'product/' + id);

        },
        showTasks: function() {

            uiState('task');
            $('#main').template('fieldstaff/task/index', 'order', function() {
                this.find('div').first().addClass('tabs');
            });

        },
        showNewTasks: function() {

            uiState('task');
            $('#main').template('fieldstaff/task/index', 'order', function() {
                this.find('div').first().addClass('tabs');
            });

        },
        showStock: function() {

            var userId = Client.getUserId();
            if (userId) {
                uiState('no-sidebar');
                $('#main').template('fieldstaff/stock/index', 'stock/fieldstaff/' + userId);
            } else {
                window.location.hash = 'login';
            }

        },
        showPerformance: function() {

            uiState('performance');

            var object = {
                sales: 0,
                commission: 0,
                customers: 0
            };

            var userId = Client.getUserId();
            if (userId) {

                Proxy.load('order/count/today/user/' + userId, {
                    success: function(resp) {
                        object.sales = resp.count;
                    }
                });

//                Proxy.load('order/count/week/user/' + userId, {
//                    success: function(resp) {
//                        object.sales = resp.count;
//                    }
//                });
//
//                Proxy.load('order/count/month/user/' + userId, {
//                    success: function(resp) {
//                        object.sales = resp.count;
//                    }
//                });
      
                $('#main').templateResult('fieldstaff/user/performance', object, function() {
                    this.find('div').first().addClass('tabs');
                });
    
            } else {
                window.location.hash = 'login';
            }
 
        },
        showWeeklyPerformance: function() {

            uiState('performance');
            $('#main').template('fieldstaff/user/performance', 'customer', function() {
                this.find('div').first().addClass('tabs');
            });

        },
        showMonthlyPerformance: function() {

            uiState('performance');
            $('#main').template('fieldstaff/user/performance', 'customer', function() {
                this.find('div').first().addClass('tabs');
            });

        },
        showUser: function() {

            $('#main').empty();
            uiState('no-sidebar');

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
                            success: function(res) {
                                Client.notify(res.username + ' logged in.');
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

        }
    });

    new app();
    Backbone.history.start();

}());
