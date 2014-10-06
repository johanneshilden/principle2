
window.callcenterDash = function() {

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
            "customer/:id/price-list"               : "customerPriceList",
            "product/:id"                           : "showProduct",
            "order"                                 : "showOrders",
            "order/:id"                             : "showOrder",
            "complaint/:id"                         : "showComplaint"
        },
        index: function() {
            $('#main').html('index');
        },
        showCustomers: function() {
            $('#main').render('customer', 'customer-collection-template');
        },
        showCustomer: function(id) {

            $('#main').vy('customer/' + id, 'customer-template')
                      .appendvy('order/customer/'         + id, 'customer-order-collection-template')
                      .appendvy('complaint/customer/'     + id, 'customer-complaint-collection-template')
                      .appendvy('call-activity/customer/' + id, 'customer-call-activity-collection-template')
                      .appendvy('contact/customer/'       + id, 'customer-contact-collection-template')

        },
        createOrder: function(customerId) {

            var form = $('<form></form>');

            form.append($('<div></div>').formvy({
                form      : form,
                template  : 'order-create-template',
                resource  : 'order',
                redirect  : 'customer/' + customerId,
                purge     : 'order/customer/' + customerId,
                validator : function(order) {

                    order.customerId = customerId;
                    order.userId = 1;

                    // Validate form input
                    console.log(order);
//                    for (id in order.product) {
//                        alert(typeof order.product[id]);
//                    }

                }
            }));

            $('#main').empty().append(form);

            $('#main').prependvy('product', 'order-product-select-template');

            $('#main').delegate('.order-product-item-remove', 'click', function(event) {
                $(event.target).parent().remove();
                return false;
            });

            $('#main select').on('change', function(event) {
                var productId = $(event.target).val();
                if (0 != productId) {
                    // Does a field exist already for this product?
                    if (0 == $('input[name="product[' + productId + ']"]').length) {
                        $('#main form').appendvy('product/' + productId, 'order-product-item-template');
                    }
                }
            });

        },
        createCall: function(customerId) {

            $('#main').formvy({
                template  : 'customer-call-create-template',
                resource  : 'call-activity',
                redirect  : 'customer/' + customerId,
                purge     : 'call-activity/customer/' + customerId,
                validator : function(call) {

                    // Validate form input
                }
            });

        },
        createServiceComplaint: function(customerId, obj) {

            $('#main').formvy({
                template  : 'service-complaint-create-template',
                resource  : 'complaint',
                redirect  : 'customer/' + customerId,
                purge     : 'complaint/customer/' + customerId,
                validator : function(complaint) {

                    complaint.kind       = 'service';
                    complaint.customerId = customerId;

                    // Validate form input
                    if (!complaint.description) {
                        complaint.pushError('description', 'Description field must not be blank.');
                    }
                }
            });

        },
        createQualityComplaint: function(customerId) {
            $('#main').html('createQualityComplaint');
        }, 
        createContact: function(customerId) {

            $('#main').formvy({
                template  : 'contact-create-template',
                resource  : 'customer-contact',
                redirect  : 'customer/' + customerId,
                purge     : 'contact/customer/' + customerId,
                validator : function(contact) {

                    contact.customerId = customerId;

                    // Validate form input
                    if (!contact.body) {
                        contact.pushError('body', 'Description field must not be blank.');
                    }
                }
            });

        },
        customerPriceList: function(customerId) {
            $('#main').render('product/customer/' + customerId, 'customer-price-list-template');
        }, 
        showProduct: function(id) {
            $('#main').render('product/' + id, 'product-template');
        },
        showOrders: function() {
            $('#main').render('order', 'order-collection-template');
        },
        showOrder: function(id) {
            $('#main').render('order/' + id, 'order-template');
        },
        showComplaint: function(id) {
            $('#main').render('complaint/' + id, 'complaint-template');
        }
    });
    
    new app();
    Backbone.history.start();

}
