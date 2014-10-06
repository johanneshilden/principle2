(function(){

    Client.init({
        onConnect: function() {
            $('#client-mode').html('Connected: ' + (!Client.offline));
        },
        onDisconnect: function() {
            $('#client-mode').html('Connected: ' + (!Client.offline));
        },
        cachePolicy: 'replace',
        offlineHandler: function() {
            window.location.hash = 'offline'; 
        }
    });

    // Initialize tabs
    $('#tab-nav').delegate('span.ui-icon-close', 'click', function() {
        var id = $(this).closest('li').remove().attr('aria-controls');
        $('#' + id).remove();
        $('#tab-nav').tabs('refresh');
    });

    $('#tab-nav').tabs({
        select: function(event, ui) {
            window.location.hash = ui.tab.hash.replace('-', '/');
        }
    });

    // Permanent tabs
    var customers = $('<div id="customers" class="widget"></div>');
    var orders    = $('<div id="orders" class="widget"></div>');

    $('#tab-nav').addTab('customers', 'Customer database', customers, true);
    $('#tab-nav').addTab('orders',    'Live orders',       orders,    true);

    function uiState(s) {
        switch (s) {
            case 'dashboard':
                $('#main').hide();
                $('#dashboard').show();
                break;
            case 'main':
            default:
                $('#dashboard').hide();
                $('#main').show();
        }
    }

    var app = Backbone.Router.extend({
        routes: {
            ""                                      : "index",
            "customer"                              : "showCustomers",
            "customer/:id"                          : "showCustomer",
            "customer/:id/order/create"             : "createOrder",
            "customer/:id/call/create"              : "createCall",
            "customer/:id/service-complaint/create" : "createServiceComplaint",
            "customer/:id/quality-complaint/create" : "createQualityComplaint",
            "customer/:id/contact/create"           : "createContact",
            "customer/:id/price-list"               : "showCustomerPriceList",
            "product/:id"                           : "showProduct",
            "order"                                 : "showOrders",
            "order/:id"                             : "showOrder",
            "order/:id/edit"                        : "editOrder",
            "complaint/:id"                         : "showComplaint",
            "login"                                 : "login",
            "offline"                               : "offline",
            // The following routes are included to 
            // enable history for the permanent tabs.
            "orders"                                : "index",
            "customers"                             : "index"
        },
        index: function() {

            var customers = $('<div class="widget"></div>');
            customers.template('customer/index', 'customer', function() {
                this.find('.tDefault').dataTable({
                    "bJQueryUI"       : false,
                    "bAutoWidth"      : true,
                    "sPaginationType" : "full_numbers",
                    "sDom"            : '<"tablePars"l>t<"tableFooter"ip>',
                    "oLanguage": {
                        "sLengthMenu": "<span class=\'showentries\'>Show entries:</span> _MENU_"
                    }
                });
                $('#customers').empty().append(customers);
                $('#customers select').select2({
                    minimumResultsForSearch: Number.MAX_VALUE
                });
            });

            var orders = $('<div class="widget"></div>');
            orders.template('order/index', 'order', function() {
                this.find('.tDefault').dataTable({
                    "bJQueryUI"       : false,
                    "bAutoWidth"      : true,
                    "sPaginationType" : "full_numbers",
                    "sDom"            : '<"tablePars"l>t<"tableFooter"ip>',
                    "oLanguage": {
                        "sLengthMenu": "<span class=\'showentries\'>Show entries:</span> _MENU_"
                    }
                });
                $('#orders').empty().append(orders);
                $('#orders select').select2({
                    minimumResultsForSearch: Number.MAX_VALUE
                });
            });

            uiState('dashboard');

        },
        offline: function() {
            $('#main').empty().template('offline');
            uiState('main');
        },
        login: function() {

            $('#main').empty();

            var form = $('<form></form>');
            $('#main').append(form);

            uiState('main');

            form.template0('login', function() {
                this.validate({
                    rules: {
                        user:     "required",
                        password: "required"
                    },
                    submitHandler: function(form) {
                        var login = $(form).serializeObject();
                        Client.connect(login.user, login.password, {
                            role: 'callcenter',
                            success: function(res) {
                                Client.notify(res.username + ' logged in.');
                                window.location.hash = '';
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
        showCustomers: function() {

            var div = $('<div class="widget"></div>');
            div.template('customer/index', 'customer', function() {
                this.find('.tDefault').dataTable();
            });

            $('#main').empty().append(div);

            uiState('main');

        },
        showCustomer: function(id) {

           $('#tab-nav').loadTab('customer/' + id, 'customer-' + id, function(customer) {

                var view    = $('<div></div>');
                var wrapper = $('<div class="widget"></div>');
                var summary = $('<div></div>').template('customer/view', 'customer/' + id);

                var tabs = $('<div id="customer-'      + id + '-tabs"><ul class="inline-tabs">'
                           + '<li><a href="#customer-' + id + '-tabs-1">Order history</a></li>'
                           + '<li><a href="#customer-' + id + '-tabs-2">Complaint history</a></li>'
                           + '<li><a href="#customer-' + id + '-tabs-3">Call activity</a></li>'
                           + '<li><a href="#customer-' + id + '-tabs-4">Contact details</a></li>'
                           + '</ul></div>');

                var orders     = $('<div class="widget"></div>').template('customer/orders',          'order/customer/'         + id);
                var complaints = $('<div class="widget"></div>').template('customer/complaints',      'complaint/customer/'     + id);
                var calls      = $('<div class="widget"></div>').template('customer/call-activities', 'call-activity/customer/' + id);
                var contacts   = $('<div class="widget"></div>').template('customer/contacts',        'contact/customer/'       + id);

                tabs.append($('<div id="customer-' + id + '-tabs-1"></div>').append(orders));
                tabs.append($('<div id="customer-' + id + '-tabs-2"></div>').append(complaints));
                tabs.append($('<div id="customer-' + id + '-tabs-3"></div>').append(calls));
                tabs.append($('<div id="customer-' + id + '-tabs-4"></div>').append(contacts));

                wrapper.prepend($('<div class="whead"><h6>Customer details</h6></div>'));
                wrapper.append(summary);
                wrapper.append(tabs);
                view.append(wrapper);

                tabs.tabs();

                $('#tab-nav').addTab('customer-' + id, customer.name, view);

            });

            uiState('dashboard');
 
        },
        showOrders: function() {

            var div = $('<div class="widget"></div>');
            div.template('order/index', 'order', function() {
                this.find('.tDefault').dataTable();
            });
 
            $('#main').empty().append(div);

            uiState('main');

        },
        showOrder: function(id) {

            var wrapper = $('<div class="widget"></div>');

            wrapper.append($('<div class="whead"><h6>Order details</h6></div>'));
            wrapper.append($('<div></div>').template('order/view', 'order/' + id));
            wrapper.append($('<div class="whead wsection"><h6>Order products</h6></div>'));
            wrapper.append($('<div></div>').template('order/products', 'product/order/' + id));

            $('#main').empty()
            $('#main').append(wrapper);

            uiState('main');

        },
        editOrder: function(id) {
            $('#main').empty()

            var form = $('<form></form>');
            $('#main').append(form);

            uiState('main');

            form.template('order/edit', 'order/' + id, function() {
                this.validate({
                   submitHandler: function(form) {
                       alert('ok');
                   }
                });
            });
        },
        createOrder: function(customerId) {

            $('#main').empty();

            //var form = $('<div class="widget"><form></form></div>');
            var form = $('<form></form>');
            form.prepend($('<div class="whead"><h6>New order</h6></div>'));
            $('#main').append(form);

            uiState('main');

            form.template('order/create', 'product/customer/' + customerId, function() {

                $('#main select').select2();

                this.validate({
                    submitHandler: function(form) {

                        var order = $(form).serializeObject();

                        var products = [];
                        for (key in order.product) {
                            products.push({
                                productId : key,
                                quantity  : order.product[key]
                            });
                        }

                        var userId = Client.getUserId();

                        var order = {
                            customerId : customerId,
                            userId     : userId,
                            products   : products
                        };

                        Proxy.write('POST', '!order', order, {
                            success: function(resp) {
                                Client.notify(resp.message);
                                window.location.hash = 'order';
                            },
                            error: function(e) {
                                console.log(e);
                            }
                        });

                    }
                });
            });

            form.delegate('select', 'change', function(event) {
                var productId = $(event.target).val();
                if (0 != productId) {
                    // Does a field exist already for this product?
                    if (0 == $('input[name="product[' + productId + ']"]').length) {
                        form.template('order/product', 'product/' + productId, function() {
                            form.find('.spinner').spinner({
                                min: 0
                            });
                        });
                    }
                    $(event.target).val(0);
                }
            });

            form.delegate('.order-product-item-remove', 'click', function(event) {
                $(event.target).parent().remove();
                return false;
            });

        },
        showProduct: function(id) {
            
            var div = $('<div class="widget"></div>').template('product/view', 'product/' + id);
            $('#main').empty()
            $('#main').append(div);

            uiState('main');
        },
        showComplaint: function(id) {

            var div = $('<div class="widget"></div>').template('complaint/view', 'complaint/' + id);
            div.prepend($('<div class="whead"><h6>Complaint description</h6></div>'));

            $('#main').empty();
            $('#main').append(div);

            uiState('main');
        },
        showCustomerPriceList: function(customerId) {

            var div = $('<div class="widget"></div>').template('customer/price-list', 'product/customer/' + customerId);
            $('#main').empty()
            $('#main').append(div);

            uiState('main');
        },
        createServiceComplaint: function(customerId) {

            $('#main').empty();

            var form = $('<form></form>');
            $('#main').append(form);

            uiState('main');

            form.template0('complaint/service/create', function() {
                this.validate({
                    rules: {
                        description: "required" 
                    },
                    submitHandler: function(form) {
                        var complaint = $(form).serializeObject();

                        complaint.kind = 'service';
                        complaint.customerId = customerId;

                        Proxy.write('POST', 'complaint', complaint, {
                            complete: function() {
                                window.location.hash = 'customer/' + customerId;
                            },
                            purge: 'complaint/customer/' + customerId
                        });
                    }
                });
            });

        },
        createQualityComplaint: function(customerId) {

            $('#main').empty();

            var form = $('<form></form>');
            $('#main').append(form);

            uiState('main');

            form.template('complaint/quality/create', 'product', function() {
                this.validate({
                    rules: {
                        description: "required" 
                    },
                    submitHandler: function(form) {
                        var complaint = $(form).serializeObject();

                        complaint.kind = 'service';
                        complaint.customerId = customerId;

                        // @todo
                    }
                });
            });

            form.delegate('select', 'change', function(event) {
                var productId = $(event.target).val();
                if (0 != productId) {
                    // Does a field exist already for this product?
                    if (0 == $('input[name="complaint-product[' + productId + ']"]').length) {
                        form.template('complaint/quality/product', 'product/' + productId);
                    }
                    $(event.target).val(0);
                }
            });

        },
        createContact: function(customerId) {

            $('#main').empty();

            var div  = $('<div class="widget fluid"></div>');
            var form = $('<form></form>');

            $('#main').append(div.append(form));

            uiState('main');

            form.template0('contact/create', function() {

                this.find('select.styled').select2();

                this.validate({
                    rules: {
                        body: "required"
                    },
                    submitHandler: function(form) {
                        var contact = $(form).serializeObject();

                        contact.customerId = customerId;

                        Proxy.write('POST', 'customer-contact', contact, {
                            complete: function() {
                                window.location.hash = 'customer/' + customerId;
                            },
                            purge: 'contact/customer/' + customerId
                        });
                    }
                });
            });

        }

    });

    new app();
    Backbone.history.start();

}()); 
