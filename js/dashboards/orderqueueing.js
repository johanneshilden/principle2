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

    function getOrderIds() {
        var boxes = $('#queueing-orders').find('input:checked');
        var ids = [];

        boxes.each(function() {
            ids.push($(this).attr('value'));
        });
        return ids;
    };

    var app = Backbone.Router.extend({
        routes: {
            ""                                      : "index",
            "offline"                               : "offline",
            "dispatch"                              : "showDispatches",
            "dispatch/:id"                          : "showDispatch",
            "queueing/vehicles"                     : "showAvailableVehicles",
            "queueing/vehicle/:id"                  : "queueVehicle",
            "customer/:id"                          : "showCustomer"
        },
        index: function() {
            $('#main').empty();
        },
        offline: function() {
            $('#main').empty().template('offline');
        },
        showDispatches: function() {
            $('#main').empty().template('dispatch/index', 'dispatch');
        },
        showDispatch: function(id) {
            $('#main').empty().template('dispatch/view', 'dispatch/' + id);
        },
        queueVehicle: function(id) {

            $('#main').empty();

            var form    = $('<form></form>');
            var pbar    = $('<div></div>');
            var wrapper = $('<div id="queueing-orders"></div>');

            $('#main').append(form);
            $('#main').append(pbar);
            $('#main').append(wrapper);

            form.template('queueing/index', 'area/vehicle/' + id, function() {
                this.validate({
                    submitHandler: function(form) {
                        // Create the dispatch
                        var oids = getOrderIds();

                        var dispatch = {
                            vehicleId: id,
                            orders: oids
                        };

                        Proxy.write('POST', '!dispatch', dispatch, {
                            success: function(resp) {
                                Client.notify(resp.message);
                                window.location.hash = '';
                            }
                        });
                    }
                });
            });

            wrapper.template('queueing/orders', 'order');

            var updatePbar = function(checkbox) {

                // Collect ids of all selected checkboxes
                var oids = getOrderIds();

                // Get all order products 
                Datasource.request({
                    resource: 'limits',
                    type: 'POST',
                    data: {
                        orders: oids,
                        vehicleId: id 
                    },
                    success: function(resp) {
                        var tot = 0;
                        for (key in resp) {
                            var item = resp[key];
                            tot += item.quantity / item.limit;
                        }
                        var percent = tot * 100;
                        if (percent <= 100) {
                            pbar.html(percent + '%');
                        } else if (checkbox) {
                            $(checkbox).attr('checked', false);

                            alert('The selected order would overload the vehicle.');
                        }
                    }
                });
 
            };

            form.delegate('select', 'change', function(event) {
                var areaId = $(event.target).val();
                var resource = (0 == areaId) ? 'order' : 'order/area/' + areaId;

                wrapper.empty().template('queueing/orders', resource);

                updatePbar();
            });

            wrapper.delegate('input.checkbox', 'change', function(event) {
                updatePbar(this);
            });
        },
        showAvailableVehicles: function() {

            Proxy.load('vehicle/available', {
                success: function(vehicles) {

                    // Group vehicles by depot 
                    vehicles.sort(function(a, b) { 
                        return a.depotId - b.depotId;
                    });

                    $('#main').empty().templateResult('vehicle/available', vehicles);

                }
            });

        },
        showCustomer: function(id) {
            // ...
        }
    });

    new app();
    Backbone.history.start();

}());
