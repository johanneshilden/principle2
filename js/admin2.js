var Model = {

    getFieldstaffUsers: function(yield) {

        Storage.collection('user/fieldstaff', 'fieldstaff-users', yield);

    },

    getCallcenterUsers: function(yield) {

        Storage.collection('user/callcenter', 'callcenter-users', yield);

    },

    getDepotManagers: function(yield) {

        Storage.collection('user/depot-manager', 'depot-managers', yield);

    },

    getAreas: function(yield) {

        var resources = {
            fieldstaffUsers : 'user/fieldstaff',
            callcenterUsers : 'user/callcenter',
            areas           : 'area'
        };

        var decorator = function(resp) {

            var areas = Storage.toMap(resp.areas);

            _.each(areas, function(a) {
                a.fieldstaffUser = null;
                a.callcenterUser = null;
            })

            _.each(resp.callcenterUsers, function(user) {
                if (areas.hasOwnProperty(user.areaId)) {
                    areas[user.areaId].callcenterUser = user; 
                }
            });
            _.each(resp.fieldstaffUsers, function(user) {
                if (areas.hasOwnProperty(user.areaId)) {
                    areas[user.areaId].fieldstaffUser = user;
                }
            });

            Storage.insert('fieldstaff-users', resp.fieldstaffUsers);
            Storage.insert('callcenter-users', resp.callcenterUsers);

            return areas;

        };

        Storage.load(resources, 'areas', yield, decorator);

    },

    getAreasForRegion: function(regionId, yield) {

        if (typeof yield === 'undefined') {
            return function(yield) {
                return Model.getAreasForRegion(regionId, yield);
            };
        }

        Model.getAreas(function(areas) {
            yield(_.filter(areas, function(item) {
                return item.regionId == regionId;
            }));
        });

    },

    getArea: function(id, yield) {

        if (typeof yield === 'undefined') {
            return function(yield) {
                return Model.getArea(id, yield);
            };
        }

        Model.getAreas(function(areas) {
            Storage.find(id, areas, yield);
        });

    },

    getCustomers: function(yield) {

        Storage.collection('customer', 'customers', yield);

    },

    getCustomer: function(id, yield) {

        if (typeof yield === 'undefined') {
            return function(yield) {
                return Model.getCustomer(id, yield);
            };
        }

        Model.getCustomers(function(customers) {
            Storage.find(id, customers, function(customer) {

                var decorator = function(resp) {
                    customer.contact = resp;

                    _.each(resp, function(contact) {
                        contact.customerName = customer.name;
                        Storage.insert('contact/' + contact.id, contact);
                    });

                    return customer;
                };
            
                Storage.load('contact/customer/' + id, 'customer/' + id, yield, decorator);

            });
        });

    },

    getPriceCategories: function(yield) {

        Storage.collection('price-category', 'price-categories', yield);

    },

    getPriceCategory: function(id, yield) {

        if (typeof yield === 'undefined') {
            return function(yield) {
                return Model.getPriceCategory(id, yield);
            };
        }

        Model.getPriceCategories(function(categories) {
            Storage.find(id, categories, yield);
        });

    },

    getDepots: function(yield) {

        var resources = {
            depots   : 'depot',
            managers : 'user/depot-manager'
        };

        var decorator = function(resp) {

            var depots = Storage.toMap(resp.depots);

            _.each(resp.managers, function(user) {
                if (depots.hasOwnProperty(user.depotId)) {
                    depots[user.depotId].depotManager = user; 
                }
            });
 
            return depots;
        };

        Storage.load(resources, 'depots', yield, decorator);

    },

    getDepot: function(id, yield) {

        if (typeof yield === 'undefined') {
            return function(yield) {
                return Model.getDepot(id, yield);
            };
        }

        Model.getDepots(function(depots) {
            Storage.find(id, depots, yield);
        });

    },

    getRegionDepots: function(regionId, yield) {

        if (typeof yield === 'undefined') {
            return function(yield) {
                return Model.getRegionDepots(regionId, yield);
            };
        }

        Model.getDepots(function(depots) {

            // Collect all depots for the region.
            var regionDepots = _.filter(depots, function(item) {
                return item.regionId == regionId;
            });

            yield(regionDepots);

        });
    },

    getRegions: function(yield) {

        Storage.collection('region', 'regions', yield);

    },

    getRegion: function(id, yield) {

        if (typeof yield === 'undefined') {
            return function(yield) {
                return Model.getRegion(id, yield);
            };
        }

        Model.getRegions(function(regions) {
            Storage.find(id, regions, yield);
        });

    },

    getContactTypes: function(yield) {
        yield({
            'physical-address' : 'Physical Address',
            'po-box-address'   : 'P.O. Box Address',
            'landline-phone'   : 'Landline Phone Number',
            'mobile-phone'     : 'Mobile Phone Number',
            'email-address'    : 'Email Address'
        });
    },

    getContact: function(id, yield) {

        if (typeof yield === 'undefined') {
            return function(yield) {
                return Model.getContact(id, yield);
            };
        }

        Storage.load('contact/' + id, 'contact/' + id, yield);

    },

    getComplaints: function(yield) {

        Storage.collection('complaint', 'complaints', yield);

    },

    getComplaint: function(id, yield) {

        if (typeof yield === 'undefined') {
            return function(yield) {
                return Model.getComplaint(id, yield);
            };
        }

        Model.getComplaints(function(complaints) {
            Storage.find(id, complaints, yield);
        });

    },

    getDamageTypes: function(yield) {

        Storage.collection('stock-damage-type', 'damage-types', yield);

    },

    getDamageType: function(id, yield) {

        Model.getDamageTypes(function(damageTypes) {
            Storage.find(id, damageTypes, yield);
        });

    },

    getVehicles: function(yield) {
        
        Storage.collection('vehicle', 'vehicles', yield);

    },

    getVehicle: function(id, yield) {
        
        if (typeof yield === 'undefined') {
            return function(yield) {
                return Model.getVehicle(id, yield);
            };
        }

        Model.getVehicles(function(vehicles) {
            Storage.find(id, vehicles, yield);
        });

    },

    getProducts: function(yield) {
        
        var resources = {
            products : 'product',
            prices   : 'product-price'
        };

        var decorator = function(resp) {

            var products = Storage.toMap(resp.products);

            // Insert product prices
            _.each(resp.prices, function(item) {
                var a = products[item.productId]['category'] || {};
                a[item.priceCatId] = item;
                products[item.productId]['category'] = a;
            });

            return products;

        };

        Storage.load(resources, 'products', yield, decorator);

    },

    getActiveProducts: function(yield) {

        Model.getProducts(function(products) {
            yield(_.filter(products, function(item) {
                return item.deleted == false;
            }));
        });

    },

    getDeletedProducts: function(yield) {

        Model.getProducts(function(products) {
            yield(_.filter(products, function(item) {
                return item.deleted == true;
            }));
        });

    },

    getProduct: function(id, yield) {

        if (typeof yield === 'undefined') {
            return function(yield) {
                return Model.getProduct(id, yield);
            };
        }

        Model.getProducts(function(products) {
            Storage.find(id, products, yield);
        });

    },

    getWeightClasses: function(yield) {

        Storage.collection('weight-category', 'weight-categories', yield);

    },

    getWeightClass: function(id, yield) {

        if (typeof yield === 'undefined') {
            return function(yield) {
                return Model.getWeightClass(id, yield);
            };
        }

        Model.getWeightClasses(function(classes) {
            Storage.find(id, classes, yield);
        });

    },

    getMaintenanceTypes: function(yield) {

        Storage.collection('maintenance-activity-type', 'maintenance-activity-types', yield);

    },

    getMaintenanceType: function(id, yield) {

        if (typeof yield === 'undefined') {
            return function(yield) {
                return Model.getMaintenanceType(id, yield);
            };
        }

        Model.getMaintenanceTypes(function(types) {
            Storage.find(id, types, yield);
        });

    },

    getUsers: function(yield) {

        Storage.collection('user/all', 'users', yield);

    },

    getDrivers: function(yield) {

        Storage.collection('user/driver', 'drivers', yield);

    },

    getAreaForCallcenterUser: function(yield) {

//        var user = App.user();
//        if (user.role === 'callcenter') {
//            Model.getCallcenterUsers(function(users) {
//                var info = Storage.toMap(users)[user.id];
//                if (info && info.areaId) {
//                    yield(info.areaId);
//                } else {
//                    App.error({
//                        responseJSON: { message: 'No area assigned to call center user.' }
//                    });
//                }
//            });
//        } else {
//            App.error({
//                responseJSON: { message: 'Invalid user type.' }
//            });
//        }

    },

    getAreaForFieldstaffUser: function(yield) {

        var user = App.user();
        if (user.role === 'fieldstaff') {
            Model.getFieldstaffUsers(function(users) {

                var info = users[user.id];
                console.log(info);

                if (info && info.areaId) {
                    yield(info.areaId);
                } else {
                    App.error({
                        responseJSON: { message: 'No area assigned to field staff user.' }
                    });
                }
            });
        } else {
            App.error({
                responseJSON: { message: 'Invalid user type.' }
            });
        }

    },

    getDepotForFieldstaffUser: function(yield) {

        Model.getAreaForFieldstaffUser(function(areaId) {
            Model.getArea(areaId, function(area) {
                if (!area.depotId) {
                    App.error({
                        responseJSON: { message: 'No depot assigned to area "' + area.name + '".' }
                    });
                } else {
                    yield(area.depotId);
                }
            });
        });

    },

    getOrders: function(yield) {

        Storage.collection('order', 'orders', yield);

    },

    getOrdersWithStatus: function(stat, yield) {

        if (typeof yield === 'undefined') {
            return function(yield) {
                return Model.getOrdersWithStatus(stat, yield);
            };
        }

        Model.getOrders(function(orders) {
            yield(_.filter(orders, function(item) {
                return item.status == stat;
            }));
        });

    }

};

App.init({
    routes: {
        ""                              : "index",
        "flush"                         : "emptyCache",
        "logout"                        : "logout",
        "queue"                         : "showQueue",
        // ---------------------------- :
        // area                         :
        // ---------------------------- :
        "areas"                         : "showAreas",
        "area/create/region/:id"        : "createArea",
        "area/edit/:id"                 : "editArea",
        "area/delete/:id"               : "deleteArea",
        "area/:id"                      : "viewArea",
        // ---------------------------- :
        // regions                      :
        // ---------------------------- :
        "regions"                       : "showRegions",
        "region/edit/:id"               : "editRegion",
        "region/delete/:id"             : "deleteRegion",
        "region/create"                 : "createRegion",
        "region/:id"                    : "viewRegion",
        // ---------------------------- :
        // depot                        :
        // ---------------------------- :
        "depots"                        : "showDepots",
        "depots/region/:id"             : "showDepotsForRegion",
        "depot/edit/:id"                : "editDepot",
        "depot/delete/:id"              : "deleteDepot",
        "depot/create/region/:id"       : "createDepot",
        // ---------------------------- :
        // driver                       :
        // ---------------------------- :
        "driver"                        : "manageDrivers",
        "driver/assign/vehicle/:id"     : "assignDriverToVehicle",
        // ---------------------------- :
        // fuel                         :
        // ---------------------------- :
        "fuel-management"               : "manageFuel",
        "fuel/manage/vehicle/:id"       : "showFuelLogForVehicle",
        // ---------------------------- :
        // maintenance                  :
        // ---------------------------- :
        "vehicle-maintenance"           : "manageVehicleMaintenance",
        "maintenance/vehicle/:id"       : "showMaintenanceForVehicle",
        // ---------------------------- :
        // maintenance-activity-type    :
        // ---------------------------- :
        "maintenance-types"             : "showMaintenanceActivityTypes",
        "maintenance-type/edit/:id"     : "editMaintenanceActivityType",
        "maintenance-type/delete/:id"   : "deleteMaintenanceActivityType",
        "maintenance-type/create"       : "createMaintenanceActivityType",
        // ---------------------------- :
        // customer                     :
        // ---------------------------- :
        "customers"                     : "showCustomers",
        "customers/area/:id"            : "showCustomersForArea",
        "customer/edit/:id"             : "editCustomer",
        "customer/create"               : "createCustomer",
        "customer/:id"                  : "viewCustomer",
        // ---------------------------- :
        // contact                      :
        // ---------------------------- :
        "contact/customer/:id/create"   : "createCustomerContact",
        "contact/:id/edit"              : "editCustomerContact",
        "contact/:id/delete"            : "deleteCustomerContact",
        // ---------------------------- :
        // customer-activity            :
        // ---------------------------- :
        "activity/customer/:id"         : "showCustomerActivity",
        // ---------------------------- :
        // complaint                    :
        // ---------------------------- :
        "complaints"                    : "showComplaints",
        "complaints/customer/:id"       : "showComplaintsForCustomer",
        "complaint/:id"                 : "viewComplaint",
        "service-complaint/create/customer/:id" 
                                        : "createServiceComplaint",
        "quality-complaint/create/customer/:id" 
                                        : "createQualityComplaint",
        // ---------------------------- :
        // stock-damage                 :
        // ---------------------------- :
        "damage-types"                  : "showDamageTypes",
        "damage-type/edit/:id"          : "editDamageType",
        "damage-type/delete/:id"        : "deleteDamageType",
        "damage-type/create"            : "createDamageType",
        // ---------------------------- :
        // stock-activity               :
        // ---------------------------- :
        "stock-activity/depot/:id"      : "showStockActivityForDepot",
        // ---------------------------- :
        // stock                        :
        // ---------------------------- :
        "stock"                         : "manageStock",
        "stock/depot/:id"               : "showStockForDepot",
        // ---------------------------- :
        // vehicle                      :
        // ---------------------------- :
        "vehicles/depot/:id"            : "showVehiclesForDepot",
        "vehicles"                      : "showVehicles",
        "vehicle/edit/:id"              : "editVehicle",
        "vehicle/delete/:id"            : "deleteVehicle",
        "vehicle/create"                : "createVehicle",
        "vehicle/:id"                   : "viewVehicle",
        // ---------------------------- :
        // product-price-category       :
        // ---------------------------- :
        "price-categories"              : "showPriceCategories",
        "price-category/edit/:id"       : "editPriceCategory",
        "price-category/delete/:id"     : "deletePriceCategory",
        "price-category/create"         : "createPriceCategory",
        // ---------------------------- :
        // product                      :
        // ---------------------------- :
        "products"                      : "showProducts",
        "products/deleted"              : "showDeletedProducts",
        "product/edit/:id"              : "editProduct",
        "product/create"                : "createProduct",
        "product/:id"                   : "viewProduct",
        // ---------------------------- :
        // weight-category              :
        // ---------------------------- :
        "weight-classes"                : "showWeightClasses",
        "weight-class/edit/:id"         : "editWeightClass",
        "weight-class/delete/:id"       : "deleteWeightClass",
        "weight-class/create"           : "createWeightClass",
        // ---------------------------- :
        // user                         :
        // ---------------------------- :
        "users"                         : "showUsers",
        "user/edit/:id"                 : "editUser",
        "user/create"                   : "createUser",
        // ---------------------------- :
        // commission                   :
        // ---------------------------- :
        "commissions/edit"              : "editCommissionMatrix",
        // ---------------------------- :
        // system                       :
        // ---------------------------- :
        "system/activity"               : "showSystemActivityLog",
 
        // //////////////////////////// :
        // FIELD STAFF                  :
        // //////////////////////////// :

        // ---------------------------- :
        // customer                     :
        // ---------------------------- :
        "!f/customers/all"              : "fieldstaff_showAllCustomers",
        "!f/customers"                  : "fieldstaff_showCustomers",
        "!f/customer/:id"               : "fieldstaff_viewCustomer",
        // ---------------------------- :
        // order                        :
        // ---------------------------- :
        "!f/orders"                     : "fieldstaff_showOrders",
        // ---------------------------- :
        // stock                        :
        // ---------------------------- :
        "!f/stock"                      : "fieldstaff_showStock",
 
        // ---------------------------- :
        // task                         :
        // ---------------------------- :
 
        // ---------------------------- :
        // performance                  :
        // ---------------------------- :
 
        // ---------------------------- :
        // user                         :
        // ---------------------------- :
 
        // //////////////////////////// :
        // DRIVER                       :
        // //////////////////////////// :

        //"!v/index"

        // //////////////////////////// :
        // CALL CENTER                  :
        // //////////////////////////// :

        // ---------------------------- :
        // customer                     :
        // ---------------------------- :
        "!c/customers"                  : "callcenter_showCustomers",
        "!c/location/customer/:id"      : "callcenter_viewCustomerLocation",
        "!c/tasks/customer/:id"         : "callcenter_viewTasksForCustomer",
        "!c/orders/customer/:id"        : "callcenter_viewOrdersForCustomer",
        "!c/complaints/customer/:id"    : "callcenter_viewComplaintsForCustomer",
        "!c/activity/customer/:id"      : "callcenter_viewActivityForCustomer",
        "!c/contacts/customer/:id"      : "callcenter_viewContactsForCustomer",
        "!c/customer/:id"               : "callcenter_viewCustomer",
        "!c/activity"                   : "callcenter_registerActivity",
        // ---------------------------- :
        // order                        :
        // ---------------------------- :
        "!c/orders/date/:date"          : "callcenter_showOrdersForDate",
        "!c/orders"                     : "callcenter_showOrders",
        "!c/order/edit/:id"             : "callcenter_editOrder",
        "!c/order/delete/:id"           : "callcenter_deleteOrder",
        "!c/order/:id"                  : "callcenter_viewOrder",
        // ---------------------------- :
        // product                      :
        // ---------------------------- :
        "!c/price-list"                 : "callcenter_showProducts",
        "!c/product/:id"                : "callcenter_viewProduct",
        // ---------------------------- :
        // sidebar                      :
        // ---------------------------- :
        "!c/sidebar/tasks"              : "callcenter_showTasks",
        "!c/sidebar/stock"              : "callcenter_showStockSummary",
        "!c/sidebar/calendar"           : "callcenter_showCalendar",
 
        // //////////////////////////// :
        // DEPOT MANAGEMENT             :
        // //////////////////////////// :

        // ---------------------------- :
        // order                        :
        // ---------------------------- :
        "!d/queued"                     : "depot_showQueuedOrders",
        "!d/dispatched"                 : "depot_showDispatchedOrders",
        // ---------------------------- :
        // customer                     :
        // ---------------------------- :
        "!d/customer/:id"               : "depot_viewCustomer",
        // ---------------------------- :
        // vehicle                      :
        // ---------------------------- :
        "!d/vehicle/:id"                : "depot_viewVehicle",
        // ---------------------------- :
        // driver                       :
        // ---------------------------- :
        "!d/sidebar/drivers"            : "depot_showDrivers",
        // ---------------------------- :
        // stock                        :
        // ---------------------------- :
        "!d/sidebar/stock-summary"      : "depot_showStockSummary",
        "!d/sidebar/add-stock"          : "depot_addStock",
        "!d/sidebar/report-damages"     : "depot_reportStockDamages",
        "!d/sidebar/stock-adjustment"   : "depot_makeStockAdjustment",

        // //////////////////////////// :
        // ORDER QUEUEING               :
        // //////////////////////////// :

        // ---------------------------- :
        // dispatch                     :
        // ---------------------------- :
        "!q/dispatches"                 : "queueing_showDispatches",
        "!q/dispatch/:id"               : "queueing_viewDispatch",
        "!q/load/vehicle/:id"           : "queueing_load",

        // ---------------------------- :
        // vehicle                      :
        // ---------------------------- :
        "!q/vehicles"                   : "queueing_showVehicles",
        "!q/vehicle/:id"                : "queueing_viewVehicle",
  
        // ---------------------------- :
        // order                        :
        // ---------------------------- :
        "!q/order/:id"                  : "queueing_viewOrder",
 
        // ---------------------------- :
        // product                      :
        // ---------------------------- :
        "!q/product/:id"                : "queueing_viewProduct"
 
    },
    index: function() {
        $('#main').html('index');
    },
    error: function(e) {
        T.render('admin/error', function(t) {

            var message = 'Unknown error.';
            
            if (e) {
                var obj = e.responseJSON;
                if (obj && obj.message) {
                    message = obj.message;
                } else {
                    message = e.responseText;
                }
            }
    
            $('#main').html(t({message: message}));

        });
    },
    offline: function() {
        $('#main').html('offline');
    },
    notify: function(msg) {
        $('#log').prepend('<tr><td>' + msg + ' </td><td><a href="javascript:" class="note-dismiss">Dismiss</a></td></tr>');
    },
    emptyCache: function() {
        store.clear();
        $('#main').html('Cache cleared!');
    },
    onRequestBegin: function() {
        $('#info').html('Loading...');
    },
    onRequestEnd: function() {
        $('#info').html('');
    },
    login: function() {
        T.render('admin/login', function(t) {

            var form = $('<form></form>').append(t());
            $('#main').html(form);
 
            form.validate({
                rules: {
                    user     : "required",
                    password : "required"
                },
                submitHandler: function(form) {

                    var user  = form['user'].value,
                        pass  = form['password'].value,
                        token = $(document.body).data('key');
 
                    App.authenticate(user, CryptoJS.HmacSHA1(pass, token).toString());

                }
            });
 
        });
    },
    logout: function() {
        App.logout();
    },
    showQueue: function() {
        T.render('admin/queue', function(t) {

            var queue = Storage.queue.get();
            delete(queue.last);

            $('#main').html(t(_.isEmpty(queue) ? null : queue));

            $('a.queue-item-process').click(function() {
                Storage.queue.process($(this).data('id'), function() {
                    App.refresh();
                });
            });

            $('a.queue-item-remove').click(function() {
                Storage.queue.remove($(this).data('id'));
                App.refresh();
            });

            $('button.queue-process').click(function() {

                var i = 0, items = $('input[name="queue-item"]:checked');
                _.each(items, function(el) {
                    var index = $(el).data('id');
                    Storage.queue.process(index, function() {
                        if (++i === items.length) {
                            App.refresh();
                        }
                    });
                });

            });

        });
    },
    showAreas: function() {
        T.render('admin/area/index', function(t) {
            Model.getAreas(function(areas) {
                $('#main').html(t({area: areas}));
            });
        });
    },
    viewArea: function(id) {
        T.render('admin/area/view', function(t) {
            Model.getArea(id, function(area) {
                $('#main').html(t(area));
            });
        });
    },
    showRegions: function() {
        T.render('admin/region/index', function(t) {
            Model.getRegions(function(regions) {
                $('#main').html(t({region: regions}));
            });
        });
    },
    editRegion: function(id) {
        T.render('admin/region/edit', function(t) {
            Model.getRegion(id, function(region) {

                var form = $('<form></form>').append(t(region));
                $('#main').html(form);

                form.validate({
                    rules: {
                        "name": "required"
                    },
                    submitHandler: function(form) {

                        var data = {
                            name     : form['name'].value
                        };

                        Storage.process({
                            type        : 'PUT',
                            resource    : 'region/' + id,
                            data        : data,
                            description : 'Edit region "' + region.name + '".',
                            purge       : 'regions',
                            hint        : 'The region could not be updated: ', 
                            feedback    : {
                                'SQL_UNIQUE_CONSTRAINT_VIOLATION': 'A region with the name "' + data.name + '" already exists.'
                            },
                            complete: function() {
                                window.location.hash = 'regions';
                            }
                        });

                    }
                });

            });
        });
    },
    deleteRegion: function(id) {
        T.render('admin/region/delete', function(t) {

            Model.getRegion(id, function(region) {

                $('#main').html(t(region));

                $('button.confirm').click(function() {

                    Storage.process({
                        type        : 'DELETE',
                        resource    : 'region/' + id,
                        data        : '',
                        description : 'Delete region "' + region.name + '".',
                        purge       : 'regions',
                        hint        : 'Cannot delete region: ',
                        feedback    : {
                            'SQL_FOREIGN_KEY_CONSTRAINT_VIOLATION': 'Areas and depots still present in the region.'
                        },
                        complete: function() {
                            window.location.hash = 'regions';
                        }
                    });

                });

            });

        });
    },
    createRegion: function() {
        T.render('admin/region/create', function(t) {

            var form = $('<form></form>').append(t());
            $('#main').html(form);

            form.validate({
                rules: {
                    "name": "required"
                },
                submitHandler: function(form) {

                    var data = {
                        name: form['name'].value
                    };

                    Storage.process({
                        type        : 'POST',
                        resource    : 'region',
                        data        : data,
                        description : 'Create a new region named "' + data.name + '".',
                        purge       : 'region',
                        hint        : 'The region could not be created: ',
                        feedback    : {
                            'SQL_UNIQUE_CONSTRAINT_VIOLATION': 'A region with the name "' + data.name + '" already exists.'
                        },
                        complete: function() {
                            window.location.hash = 'regions';
                        }
                    });

                }
            });

        });
    },
    viewRegion: function(id) {
        T.render('admin/region/view', function(t) {
            Model.getRegion(id, function(region) {
                $('#main').html(t(region));
            });
        });
    },
    showDepots: function() {
        T.render('admin/depot/index', function(t) {
            Model.getDepots(function(depots) {
                $('#main').html(t({depot: depots}));
            });
        });
    },
    showDepotsForRegion: function(regionId) {
        T.render('admin/depot/index', function(t) {
            Model.getRegionDepots(regionId, function(depots) {
                $('#main').html(t({depot: depots}));
            });
        });
    },
    editDepot: function(id) {
        T.render('admin/depot/edit', function(t) {

            Storage.chain(Model.getDepot(id))
                   .chain(Model.getDepotManagers)
                   .using(function(depot, depotManagers) {

                Model.getAreasForRegion(depot.regionId, function(areas) {

                    depot.manager = depotManagers;
                    depot.area    = areas;
    
                    var form = $('<form></form>').append(t(depot));
    
                    $('#main').html(form);
    
                    if (depot.depotManager) {
                        $('select[name="manager"]').val(depot.depotManager.id);
                    }
    
                    form.validate({
                        rules: {
                            "name"           : "required",
                            "latitude"       : "required",
                            "longitude"      : "required"
                        },
                        submitHandler: function(form) {

                            var areas = [];
                            _.each($('input[name="area"]:checked'), function(el) {
                                areas.push($(el).data('id'));
                            });

                            var data = {
                                name      : form['name'].value,
                                latitude  : form['latitude'].value, 
                                longitude : form['longitude'].value
                            };

                            var managerId = $('select[name="manager"]').val();
                            if (managerId) {
                                data.depotManagerId = managerId;
                            }

                            if (areas.length) {
                                data.areas = areas;
                            }
    
                            Storage.process({
                                type        : 'PUT',
                                resource    : '!depot/' + id,
                                data        : data,
                                description : 'Edit depot "' + depot.name + '".',
                                purge       : ['depots', 'areas', 'depot-managers'],
                                hint        : 'The depot could not be updated: ', 
                                complete: function() {
                                    window.location.hash = 'depots';
                                }
                            });
    
                        }
                    });
                });

            });

        });
    },
    deleteDepot: function(id) {
        T.render('admin/depot/delete', function(t) {

            Model.getDepot(id, function(depot) {

                $('#main').html(t(depot));

                $('button.confirm').click(function() {

                    Storage.process({
                        type        : 'DELETE',
                        resource    : '!depot/' + id,
                        data        : '',
                        description : 'Delete depot "' + depot.name + '".',
                        purge       : 'depots',
                        hint        : 'Cannot delete depot: ',
                        feedback    : {
                            'SQL_FOREIGN_KEY_CONSTRAINT_VIOLATION': 'This depot has assigned vehicles.'
                        },
                        complete: function() {
                            window.location.hash = 'depots';
                        }
                    });

                });

            });

        });
    },
    createDepot: function(regionId) {
        T.render('admin/depot/create', function(t) {

            Storage.chain(Model.getDepotManagers)
                   .chain(Model.getRegion(regionId))
                   .chain(Model.getAreasForRegion(regionId))
                   .using(function(depotManagers, region, areas) {

                var form = $('<form></form>').append(t({
                    manager : depotManagers,
                    region  : region,
                    area    : areas
                }));
 
                $('#main').html(form);
    
                form.validate({
                    rules: {
                        "name"           : "required",
                        "latitude"       : "required",
                        "longitude"      : "required"
                    },
                    submitHandler: function(form) {

                     var areas = [];
                        _.each($('input[name="area"]:checked'), function(el) {
                            areas.push($(el).data('id'));
                        });

                        var data = {
                            name           : form['name'].value,
                            latitude       : form['latitude'].value, 
                            longitude      : form['longitude'].value,
                            areas          : areas,
                            depotManagerId : $('select[name="manager"]').val(),
                            regionId       : regionId
                        };

                        Storage.process({
                            type        : 'POST',
                            resource    : '!depot',
                            data        : data,
                            description : 'Create depot "' + data.name + '".',
                            purge       : ['depots', 'areas', 'depot-managers'],
                            hint        : 'The depot could not be created: ', 
                            complete: function() {
                                window.location.hash = 'depots';
                            }
                        });

                    }
                });

            });

        });
    },
    manageDrivers: function() {
        T.render('admin/driver/index', function(t) {
            Model.getDrivers(function(drivers) {
                $('#main').html(t({driver: drivers}));
            });
        });
    },
    assignDriverToVehicle: function(vehicleId) {
        T.render('admin/vehicle/driver', function(t) {
            Model.getVehicle(vehicleId, function(vehicle) {
                Model.getDrivers(function(drivers) {

                    var form = $('<form></form>').append(t({
                        driver  : drivers,
                        vehicle : vehicle
                    }));
     
                    $('#main').html(form);

                    if (vehicle.driverId) {
                        $('select[name="driver"]').val(vehicle.driverId);
                    }
        
                    form.validate({
                        submitHandler: function(form) {

                            if (form['driver'].value) {

                                var data = {
                                    driverId  : form['driver'].value,
                                    vehicleId : vehicleId
                                };
    
                                Storage.process({
                                    type        : 'PATCH',
                                    resource    : 'vehicle/driver',
                                    data        : data,
                                    description : 'Assign a driver to vehicle ' + vehicle.regNo + '.',
                                    purge       : ['vehicles', 'drivers'],
                                    hint        : 'The driver could not be assigned to the vehicle: ', 
                                    complete: function() {
                                        window.location.hash = 'vehicles';
                                    }
                                });
    
                            } else {

                                Storage.process({
                                    type        : 'DELETE',
                                    resource    : 'vehicle/driver',
                                    data        : {vehicleId: vehicleId},
                                    description : 'Remove driver assignment for vehicle ' + vehicle.regNo + '.',
                                    purge       : ['vehicles', 'drivers'],
                                    hint        : 'The driver assignment could not be removed: ', 
                                    complete: function() {
                                        window.location.hash = 'vehicles';
                                    }
                                });
 
                            }
                        }
                    });

                });
            });
        });
    },
    manageFuel: function() {
        T.render('admin/fuel/vehicle-index', function(t) {
            Model.getVehicles(function(vehicles) {
 
                $('#main').html(t({vehicle: vehicles}));

            });
        });
    },
    showFuelLogForVehicle: function(vehicleId) {
        T.render('admin/fuel/vehicle', function(t) {
            Model.getVehicle(vehicleId, function(vehicle) {
 
                $('#main').html(t(vehicle));

            });
        });
    },
    manageVehicleMaintenance: function() {
        T.render('admin/maintenance/vehicle-index', function(t) {
            Model.getVehicles(function(vehicles) {
 
                $('#main').html(t({vehicle: vehicles}));

            });
        });
    },
    showMaintenanceForVehicle: function(vehicleId) {
        T.render('admin/maintenance/vehicle', function(t) {
            Model.getVehicle(vehicleId, function(vehicle) {
 
                $('#main').html(t(vehicle));

            });
        });
    },
    createArea: function(regionId) {
        T.render('admin/area/create', function(t) {

            Model.getRegionDepots(regionId, function(regionDepots) {

                var form = $('<form></form>').append(t({
                    depot: regionDepots
                }));

                $('#main').html(form);

                form.validate({
                    rules: {
                        "name": "required"
                    },
                    submitHandler: function(form) {

                        var data = {
                            name     : form['name'].value,
                            depotId  : form['depot'].value, 
                            regionId : regionId 
                        };

                        Storage.process({
                            type        : 'POST',
                            resource    : 'area',
                            data        : data,
                            description : 'Create a new area named "' + data.name + '".',
                            purge       : 'areas',
                            hint        : 'The area could not be created: ',
                            feedback    : {
                                'SQL_UNIQUE_CONSTRAINT_VIOLATION': 'An area with the name "' + data.name + '" already exists in the same region.'
                            },
                            complete: function() {
                                window.location.hash = 'areas';
                            }
                        });

                    }
                });

            });

        });
    },
    editArea: function(id) {
        T.render('admin/area/edit', function(t) {

            Storage.chain(Model.getArea(id))
                   .chain(Model.getFieldstaffUsers)
                   .chain(Model.getCallcenterUsers)
                   .chain(Model.getDepots)
                   .using(function(area, fieldstaff, callcenter, depots) {

                area.fieldstaff = fieldstaff;
                area.callcenter = callcenter;
                area.depot = depots;

                var form = $('<form></form>').append(t(area));
                $('#main').html(form);

                var u = area.callcenterUser ? area.callcenterUser.id : '';
                $('select[name="callcenter-user"]').val(u);

                u = area.fieldstaffUser ? area.fieldstaffUser.id : '';
                $('select[name="fieldstaff-user"]').val(u);

                $('select[name="depot"]').val(area.depotId);

                form.validate({
                    rules: {
                        "name": "required"
                    },
                    submitHandler: function(form) {

                        var data = {
                            name     : form['name'].value,
                            depotId  : form['depot'].value, 
                            regionId : area.regionId 
                        };

                        var user = form['callcenter-user'].value;
                        if (user) {
                            data.callcenterUser = user;
                        }
                        user = form['fieldstaff-user'].value;
                        if (user) {
                            data.fieldstaffUser = user;
                        }

                        Storage.process({
                            type        : 'PUT',
                            resource    : '!area/' + id,
                            data        : data,
                            description : 'Edit area "' + area.name + '".',
                            purge       : ['areas', 'fieldstaff-users', 'callcenter-users'],
                            hint        : 'The area could not be updated: ', 
                            feedback    : {
                                'SQL_UNIQUE_CONSTRAINT_VIOLATION': 'An area with the name "' + data.name + '" already exists in the same region.'
                            },
                            complete: function() {
                                window.location.hash = 'areas';
                            }
                        });

                    }
                });

            });

        });
    },
    deleteArea: function(id) {
        T.render('admin/area/delete', function(t) {

            Model.getArea(id, function(area) {

                $('#main').html(t(area));

                $('button.confirm').click(function() {

                    Storage.process({
                        type        : 'DELETE',
                        resource    : '!area/' + id,
                        data        : '',
                        description : 'Delete area "' + area.name + '".',
                        purge       : 'areas',
                        hint        : 'Cannot delete area: ',
                        feedback    : {
                            'SQL_FOREIGN_KEY_CONSTRAINT_VIOLATION': 'This area still has assigned customers.'
                        },
                        complete: function() {
                            window.location.hash = 'areas';
                        }
                    });

                });

            });

        });
    },
    showMaintenanceActivityTypes: function() {
        T.render('admin/maintenance-activity-type/index', function(t) {
            Model.getMaintenanceTypes(function(activityTypes) {
                $('#main').html(t({type: activityTypes}));
            });
        });
    },
    editMaintenanceActivityType: function(id) {

        $('#main').html('edit maintenance');

    },
    deleteMaintenanceActivityType: function(id) {

        $('#main').html('delete maintenance type');

    },
    createMaintenanceActivityType: function() {
        T.render('admin/maintenance-activity-type/create', function(t) {

            var form = $('<form></form>').append(t());
            $('#main').html(form);

            form.validate({
                rules: {
                    "name": "required"
                },
                submitHandler: function(form) {

                    var data = {
                        name     : form['name'].value
                    };

                    Storage.process({
                        type        : 'POST',
                        resource    : 'maintenance-activity-type',
                        data        : data,
                        description : 'Create a new vehicle maintenance activity type named "' + data.name + '".',
                        purge       : 'maintenance-activity-types',
                        hint        : 'The vehicle maintenance activity type could not be created: ',
                        complete: function() {
                            window.location.hash = 'maintenance-types';
                        }
                    });

                }
            });

        });
    },
    showCustomersForArea: function(areaId) {
        T.render('admin/customer/index', function(t) {
            
            Model.getCustomers(function(customers) {

                // Filter customers by area id
                var areaCustomers = _.filter(customers, function(item) {
                    return item.areaId == areaId;
                });

                $('#main').html(t({customer: areaCustomers}));

            });

        });
    },
    showCustomers: function() {
        T.render('admin/customer/index', function(t) {
            
            Model.getCustomers(function(customers) {
                $('#main').html(t({customer: customers}));
            });

        });
    },
    viewCustomer: function(id) {
        T.render('admin/customer/view', function(t) {

            Model.getCustomer(id, function(customer) {
                $('#main').html(t(customer));
            });

        });
    },
    editCustomer: function(id) {
        T.render('admin/customer/edit', function(t) {

            Storage.chain(Model.getAreas)
                   .chain(Model.getPriceCategories)
                   .chain(Model.getCustomer(id))
                   .using(function(areas, priceCategories, customer) {

                customer.area = areas;
                customer.priceCat = priceCategories;

                var form = $('<form></form>').append(t(customer));
                $('#main').html(form);

                $('select[name="area"]').val(customer.areaId);
                $('select[name="price-category"]').val(customer.priceCatId);

                form.validate({
                    rules: {
                        "name"           : "required",
                        "street-address" : "required",
                        "latitude"       : "required number",
                        "longitude"      : "required number",
                        "tin"            : "required",
                        "phone"          : "required"
                    },
                    submitHandler: function(form) {

                        var data = {
                            name          : form['name'].value,
                            latitude      : form['latitude'].value,
                            longitude     : form['longitude'].value,
                            tin           : form['tin'].value,
                            phone         : form['phone'].value,
                            streetAddress : form['street-address'].value,
                            isActive      : form['is-active'].checked,
                            areaId        : form['area'].value,
                            priceCatId    : form['price-category'].value
                        };

                        Storage.process({
                            type        : 'PUT',
                            resource    : 'customer/' + id,
                            data        : data,
                            description : 'Update customer "' + data.name + '".',
                            purge       : 'customers',
                            complete: function() {
                                window.location.hash = 'customers';
                            }
                        });

                    }
                });

            });

        });
    },
    createCustomer: function() {
        T.render('admin/customer/create', function(t) {

            Storage.chain(Model.getAreas)
                   .chain(Model.getPriceCategories)
                   .using(function(areas, priceCategories) {
   
                var form = $('<form></form>').append(t({
                    priceCategory : priceCategories,
                    area          : areas
                }));

                $('#main').html(form);

                form.validate({
                    rules: {
                        "name"           : "required",
                        "street-address" : "required",
                        "latitude"       : "required number",
                        "longitude"      : "required number",
                        "tin"            : "required",
                        "phone"          : "required"
                    },
                    submitHandler: function(form) {

                        var data = {
                            name          : form['name'].value,
                            latitude      : form['latitude'].value,
                            longitude     : form['longitude'].value,
                            tin           : form['tin'].value,
                            phone         : form['phone'].value,
                            streetAddress : form['street-address'].value,
                            isActive      : form['is-active'].checked,
                            areaId        : form['area'].value,
                            priceCatId    : form['price-category'].value
                        };

                        Storage.process({
                            type        : 'POST',
                            resource    : 'customer',
                            data        : data,
                            description : 'Create customer "' + data.name + '".',
                            purge       : 'customers',
                            hint        : 'The customer could not be created: ',
                            feedback    : {
                                'SQL_UNIQUE_CONSTRAINT_VIOLATION': 'A customer with the name "' + data.name + '" already exists.'
                            },
                            complete: function() {
                                window.location.hash = 'customers';
                            }
                        });

                    }
                });

            });

        });
    },
    createCustomerContact: function(customerId) {
        T.render('admin/contact/create', function(t) {

            Storage.chain(Model.getContactTypes)
                   .chain(Model.getCustomer(customerId))
                   .using(function(contactTypes, customer) {
    
                customer.contactType = contactTypes;

                var form = $('<form></form>').append(t(customer));
    
                $('#main').html(form);

                form.validate({
                    rules: {
                        "kind" : "required",
                        "body" : "required"
                    },
                    submitHandler: function(form) {

                        var data = {
                            customerId  : customerId,
                            kind        : form['kind'].value,
                            body        : form['body'].value, 
                            meta        : form['meta'].value
                        };

                        Storage.process({
                            type        : 'POST',
                            resource    : 'contact',
                            data        : data,
                            description : 'Create a new customer contact for customer "' + customer.name + '".',
                            purge       : ['customer/' + customerId, 'contact/customer/' + customerId],
                            hint        : 'The customer contact could not be created: ',
                            complete: function() {
                                window.location.hash = 'customer/' + customerId;
                            }
                        });
                    }
                });
    
            });

        });
    },
    editCustomerContact: function(id) {
        T.render('admin/contact/edit', function(t) {

            Storage.chain(Model.getContactTypes)
                   .chain(Model.getContact(id))
                   .using(function(contactTypes, contact) {

                var customerId = contact.customerId;

                contact.contactType = contactTypes;

                var form = $('<form></form>').append(t(contact));
                $('#main').html(form);

                form.validate({
                    rules: {
                        "kind"  : "required",
                        "body"  : "required"
                    },
                    submitHandler: function(form) {

                        var data = {
                            customerId : customerId,
                            kind       : form['kind'].value,
                            body       : form['body'].value, 
                            meta       : form['meta'].value
                        };

                        Storage.process({
                            type        : 'PUT',
                            resource    : 'contact/' + id,
                            data        : data,
                            description : 'Edit customer contact for customer "' + contact.customerName + '".',
                            purge       : ['contact/' + id, 'contact/customer/' + customerId, 'customer/' + customerId],
                            hint        : 'The customer contact could not be updated: ',
                            complete: function() {
                                window.location.hash = 'customer/' + customerId;
                            }
                        });

                    }
                });

            });

        });
    },
    deleteCustomerContact: function(id) {
        T.render('admin/contact/delete', function(t) {
            Model.getContact(id, function(contact) {

                var form = $('<form></form>').append(t(contact));
                $('#main').html(form);

                $('button.confirm').click(function() {
                    Storage.process({
                        type        : 'DELETE',
                        resource    : 'contact/' + id,
                        data        : '',
                        description : 'Delete contact for customer "' + contact.customerName + '".',
                        purge       : ['customers', 'customer/' + contact.customerId, 'contact/' + id],
                        hint        : 'Cannot delete contact: ',
                        complete: function() {
                            window.location.hash = 'customer/' + contact.customerId;
                        }
                    });
                });

            });
        });
    },
    showCustomerActivity: function(customerId) {

        $('#main').html('show customer activity');

    },
    showComplaints: function() {
        T.render('admin/complaint/index', function(t) {
            Model.getComplaints(function(complaints) {
                $('#main').html(t({complaint: complaints}));
            });
        });
    },
    showComplaintsForCustomer: function(customerId) {
        T.render('admin/complaint/customer', function(t) {
            Model.getCustomer(customerId, function(customer) {
                Model.getComplaints(function(complaints) {
    
                    var customerComplaints = _.filter(complaints, function(item) {
                        return item.customerId == customerId;
                    });

                    $('#main').html(t({
                        customer  : customer, 
                        complaint : customerComplaints
                    }));
    
                });
            });
        });
    },
    viewComplaint: function(id) {
        T.render('admin/complaint/view', function(t) {
            Model.getComplaint(id, function(complaint) {
                $('#main').html(t(complaint));

                $('button.resolve').click(function() {

                    Storage.process({
                        type        : 'PATCH',
                        resource    : 'complaint/resolve/' + id,
                        data        : '',
                        description : 'Resolve complaint from customer "' + complaint.customer + '".',
                        purge       : 'complaints',
                        complete: function() {
                            App.refresh();
                        }
                    });

                });

            });
        });
    },
    createServiceComplaint: function(customerId) {

        $('#main').html('create service complaint');

    },
    createQualityComplaint: function(customerId) {

        $('#main').html('create quality complaint');

    },
    showDamageTypes: function() {
        T.render('admin/stock-damage-type/index', function(t) {
            Model.getDamageTypes(function(damageTypes) {
                $('#main').html(t({item: damageTypes}));
            });
        });
    },
    editDamageType: function(id) {
        T.render('admin/stock-damage-type/edit', function(t) {
            Model.getDamageType(id, function(damageType) {

                var form = $('<form></form>').append(t(damageType));
                $('#main').html(form);

                form.validate({
                    rules: {
                        "name"  : "required"
                    },
                    submitHandler: function(form) {

                        var data = {
                            name : form['name'].value
                        };

                        Storage.process({
                            type        : 'PUT',
                            resource    : 'stock-damage-type/' + id,
                            data        : data,
                            description : 'Edit stock damage type: "' + data.name + '".',
                            purge       : 'damage-types',
                            hint        : 'The stock damage type could not be updated: ',
                            complete: function() {
                                window.location.hash = 'damage-types';
                            }
                        });

                    }
                });

            });
        });
    },
    deleteDamageType: function(id) {
        T.render('admin/stock-damage-type/delete', function(t) {
            Model.getDamageType(id, function(damageType) {

                var form = $('<form></form>').append(t(damageType));
                $('#main').html(form);

                $('button.confirm').click(function() {
                    Storage.process({
                        type        : 'DELETE',
                        resource    : 'stock-damage-type/' + id,
                        data        : '',
                        description : 'Delete stock damage type "' + damageType.name + '".',
                        purge       : 'damage-types',
                        hint        : 'Cannot delete damage type: ',
                        complete: function() {
                            window.location.hash = 'damage-types';
                        }
                    });
                });

            });
        });
    },
    createDamageType: function() {
        T.render('admin/stock-damage-type/create', function(t) {

            var form = $('<form></form>').append(t());
            $('#main').html(form);

            form.validate({
                rules: {
                    "name"  : "required"
                },
                submitHandler: function(form) {

                    var data = {
                        name : form['name'].value
                    };

                    Storage.process({
                        type        : 'POST',
                        resource    : 'stock-damage-type',
                        data        : data,
                        description : 'Create stock damage type: "' + data.name + '".',
                        purge       : 'damage-types',
                        hint        : 'The stock damage type could not be created: ',
                        complete: function() {
                            window.location.hash = 'damage-types';
                        }
                    });

                }
            });

        });
    },
    showStockActivityForDepot: function(depotId) {
        T.render('admin/stock/depots', function(t) {
            Storage.load('stock-activity/depot/' + depotId, 'depot-' + depotId + '-stock-activity', function(activity) {

                $('#main').html(t({activity: activity}));

            });
        });
    },
    manageStock: function() {
        T.render('admin/stock/depots', function(t) {
            Model.getDepots(function(depots) {
                $('#main').html(t({depot: depots}));
            });
        });
    },
    showStockForDepot: function(depotId) {

        T.render('admin/stock/summary', function(t) {
            Storage.load('stock/depot/' + depotId, 'depot-' + depotId + '-stock', function(stock) {
                Storage.load('stock-activity/depot/' + depotId, 'depot-' + depotId + '-stock-activity', function(activity) {

                    $('#main').html(t({
                        depotId  : depotId, 
                        item     : stock,
                        activity : activity
                    }));

                });
            });
        });
    },
    showVehiclesForDepot: function(depotId) {
        T.render('admin/vehicle/index', function(t) {
            Model.getVehicles(function(vehicles) {

                var depotVehicles = _.filter(vehicles, function(item) {
                    return item.depotId == depotId;
                });

                $('#main').html(t({vehicle: depotVehicles}));

            });
        });
    },
    showVehicles: function() {
        T.render('admin/vehicle/index', function(t) {
            Model.getVehicles(function(vehicles) {
                $('#main').html(t({vehicle: vehicles}));
            });
        });
    },
    editVehicle: function(id) {

        $('#main').html('edit vehicle');

    },
    deleteVehicle: function(id) {

        $('#main').html('delete vehicle');

    },
    createVehicle: function() {

        $('#main').html('create vehicle');

    },
    viewVehicle: function(id) {
        T.render('admin/vehicle/view', function(t) {
            Model.getVehicle(id, function(vehicle) {

                $('#main').html(t(vehicle));

            });
        });
    },
    showPriceCategories: function() {
        T.render('admin/price-category/index', function(t) {
            Model.getPriceCategories(function(priceCategories) {
                $('#main').html(t({category: priceCategories}));
            });
        });
    },
    editPriceCategory: function(id) {
        T.render('admin/price-category/edit', function(t) {
            Model.getPriceCategory(id, function(priceCategory) {

                var form = $('<form></form>').append(t(priceCategory));
                $('#main').html(form);

                form.validate({
                    rules: {
                        "name": "required"
                    },
                    submitHandler: function(form) {

                        var data = {
                            name: form['name'].value
                        };
    
                        Storage.process({
                            type        : 'PUT',
                            resource    : 'price-category/' + id,
                            data        : data,
                            description : 'Update product price category "' + priceCategory.name + '".',
                            purge       : 'price-categories',
                            hint        : 'The product price category could not be updated: ',
                            complete: function() {
                                window.location.hash = 'price-categories';
                            }
                        });
    
                    }
                });

            });
        });
    },
    deletePriceCategory: function(id) {

        $('#main').html('delete price category');

    },
    createPriceCategory: function() {
        T.render('admin/price-category/create', function(t) {

            var form = $('<form></form>').append(t());
            $('#main').html(form);

            form.validate({
                rules: {
                    "name": "required"
                },
                submitHandler: function(form) {

                    var data = {
                        name: form['name'].value
                    };

                    Storage.process({
                        type        : 'POST',
                        resource    : 'price-category',
                        data        : data,
                        description : 'Create a new product price category named "' + data.name + '".',
                        purge       : 'price-categories',
                        hint        : 'The product price category could not be created: ',
                        complete: function() {
                            window.location.hash = 'price-categories';
                        }
                    });

                }
            });

        });
    },
    showProducts: function() {
        T.render('admin/product/index', function(t) {

            Storage.chain(Model.getPriceCategories)
                   .chain(Model.getActiveProducts)
                   .using(function(priceCategories, products) {

                $('#main').html(t({
                    product  : products,
                    category : priceCategories
                }));

            });

        });
    },
    showDeletedProducts: function() {
        T.render('admin/product/deleted', function(t) {
            Model.getDeletedProducts(function(products) {
                $('#main').html(t({product: products}));
            });
        });
    },
    editProduct: function(id) {

        $('#main').html('edit product');

    },
    createProduct: function() {

        $('#main').html('create product');

    },
    viewProduct: function(id) {
        T.render('admin/product/view', function(t) {
            Model.getProduct(id, function(product) {
                $('#main').html(t(product));
            });
        });
    },
    showWeightClasses: function() {
        T.render('admin/weight-category/index', function(t) {
            Model.getWeightClasses(function(weightClasses) {
                $('#main').html(t({category: weightClasses}));
            });
        });
    },
    editWeightClass: function(id) {
        T.render('admin/weight-category/edit', function(t) {
            Model.getWeightClass(id, function(weightClass) {

                var form = $('<form></form>').append(t(weightClass));
                $('#main').html(form);
    
                form.validate({
                    rules: {
                        "name"  : "required"
                    },
                    submitHandler: function(form) {
    
                        var data = {
                            name : form['name'].value
                        };
    
                        Storage.process({
                            type        : 'PUT',
                            resource    : 'weight-category/' + id,
                            data        : data,
                            description : 'Update vehicle weight category: "' + data.name + '".',
                            purge       : 'weight-categories',
                            hint        : 'The vehicle weight category could not be updated: ',
                            complete: function() {
                                window.location.hash = 'weight-classes';
                            }
                        });
    
                    }
                });

            });
        });
    },
    deleteWeightClass: function(id) {

        $('#main').html('delete weight class');

    },
    createWeightClass: function() {
        T.render('admin/weight-category/create', function(t) {

            var form = $('<form></form>').append(t());
            $('#main').html(form);

            form.validate({
                rules: {
                    "name"  : "required"
                },
                submitHandler: function(form) {

                    var data = {
                        name : form['name'].value
                    };

                    Storage.process({
                        type        : 'POST',
                        resource    : 'weight-category',
                        data        : data,
                        description : 'Create vehicle weight category: "' + data.name + '".',
                        purge       : 'weight-categories',
                        hint        : 'The vehicle weight category could not be created: ',
                        complete: function() {
                            window.location.hash = 'weight-classes';
                        }
                    });

                }
            });

        });
    },
    showUsers: function() {
        T.render('admin/user/index', function(t) {
            Model.getUsers(function(users) {
                $('#main').html(t({user: users}));
            });
        });
    },
    editUser: function(id) {

        $('#main').html('edit user');

    },
    createUser: function() {

        $('#main').html('create user');

    },
    editCommissionMatrix: function() {

        $('#main').html('edit commission');

    },
    showSystemActivityLog: function() {

        $('#main').html('show system activity log');

    },
    fieldstaff_showAllCustomers: function() {
        T.render('fieldstaff/customer/index', function(t) {
            Model.getCustomers(function(customers) {
                $('#main').html(t({customer: customers})); 
            });
        });
    },
    fieldstaff_showCustomers: function() {
        T.render('fieldstaff/customer/index', function(t) {

            Model.getAreaForFieldstaffUser(function(areaId) {
                Model.getCustomers(function(customers) {
    
                    var areaCustomers = _.filter(customers, function(item) {
                        return item.areaId === areaId;
                    });
    
                    $('#main').html(t({customer: areaCustomers}));
    
                });
            });

        });
    },
    fieldstaff_viewCustomer: function(id) {
        T.render('fieldstaff/customer/view', function(t) {
            Model.getCustomer(id, function(customer) {
                $('#main').html(t(customer));
            });
        });
    },
    fieldstaff_showOrders: function() {
        T.render('fieldstaff/order/index', function(t) {

            Model.getAreaForFieldstaffUser(function(areaId) {
                Model.getOrders(function(orders) {

                    var areaOrders = _.filter(orders, function(item) {
                        return item.customerAreaId == areaId;
                    });

                    $('#main').html(t({order: areaOrders}));

                });
            });

        });
    },
    fieldstaff_showStock: function() {
        T.render('fieldstaff/stock/index', function(t) {
            Model.getDepotForFieldstaffUser(function(depotId) {
                Model.getDepot(depotId, function(depot) {

                    Storage.load('stock/depot/' + depotId, 'depot-' + depotId + '-stock', function(stock) {
    
                        $('#main').html(t({
                            depot  : depot, 
                            item   : stock
                        }));
    
                    });

                });
            });
        });
    },
    callcenter_showCustomers: function() {
        T.render('callcenter/customer/index', function(t) {
            
            Model.getCustomers(function(customers) {
                Model.getAreaForCallcenterUser(function(areaId) {

                    // Filter customers by area id
                    var areaCustomers = _.filter(customers, function(item) {
                        return item.areaId == areaId;
                    });

                    $('#main').html(t({customer: areaCustomers}));

                });
            });

        });
    },
    callcenter_viewCustomerLocation: function(customerId) {

        $('#main').html('cs: view customer location');

    },
    callcenter_viewTasksForCustomer: function(customerId) {

        $('#main').html('cs: view tasks for customer');

    },
    callcenter_viewOrdersForCustomer: function(customerId) {

        $('#main').html('cs: view orders for customer');

    },
    callcenter_viewComplaintsForCustomer: function(customerId) {

        $('#main').html('cs: view complaints for customer');

    },
    callcenter_viewActivityForCustomer: function(customerId) {

        $('#main').html('cs: view activity for customer');

    },
    callcenter_viewContactsForCustomer: function(customerId) {

        $('#main').html('cs: view contacts for customer');

    },
    callcenter_viewCustomer: function(id) {

        $('#main').html('cs: view customer');

    },
    callcenter_registerActivity: function() {

        $('#main').html('cs: register activity');

    },
    callcenter_showOrdersForDate: function() {

        $('#main').html('cs: show orders for date');

    },
    callcenter_showOrders: function() {

        $('#main').html('cs: show orders ');

    },
    callcenter_editOrder: function(id) {

        $('#main').html('cs: edit order');

    },
    callcenter_deleteOrder: function(id) {

        $('#main').html('cs: delete order');

    },
    callcenter_viewOrder: function(id) {

        $('#main').html('cs: view order');

    },
    callcenter_showProducts: function() {

        $('#main').html('cs: show products');

    },
    callcenter_viewProduct: function(id) {

        $('#main').html('cs: view product');

    },
    callcenter_showTasks: function() {

        $('#main').html('cs: show tasks');

    },
    callcenter_showStockSummary: function() {

        $('#main').html('cs: show stock summary');

    },
    callcenter_showCalendar: function() {

        $('#main').html('cs: show calendar');

    },
    depot_showQueuedOrders: function() {
        T.render('depot/order/index', function(t) {
            Model.getOrdersWithStatus('queued', function(orders) {

                $('#main').html(t({order: orders}));

            });
        });
    },
    depot_showDispatchedOrders: function() {
        T.render('depot/order/index', function(t) {
            Model.getOrdersWithStatus('dispatched', function(orders) {

                $('#main').html(t({order: orders}));

            });
        });
    },
    depot_viewCustomer: function(id) {

        $('#main').html('depot: show customer');

    },
    depot_viewVehicle: function(id) {
        T.render('depot/vehicle/view', function(t) {
            Model.getVehicle(id, function(vehicle) {

                $('#main').html(t(vehicle));

            });
        });
    },
    depot_showDrivers: function() {
        T.render('depot/driver/index', function(t) {
            Model.getDrivers(function(drivers) {

                $('#main').html(t({driver: drivers}));

            });
        });
    },
    depot_showStockSummary: function() {

        $('#main').html('depot: show stock summary');

    },
    depot_addStock: function() {

        $('#main').html('depot: add stock');

    },
    depot_reportStockDamages: function() {

        $('#main').html('depot: report damages');

    },
    depot_makeStockAdjustment: function() {

        $('#main').html('depot: make adjustment');

    },
    queueing_showDispatches: function() {

        $('#main').html('queueing: show dispatches');

    },
    queueing_showVehicles: function() {

        $('#main').html('queueing: show vehicles');

    },
    queueing_viewVehicle: function(id) {

        $('#main').html('queueing: view vehicle');

    },
    queueing_viewDispatch: function(id) {

        $('#main').html('queueing: view dispatch');

    },
    queueing_load: function(vehicleId) {

        $('#main').html('queueing: load');
        
    },
    queueing_viewVehicle: function(id) {

        $('#main').html('queueing: view vehicle');

    },
    queueing_viewOrder: function(id) {

        $('#main').html('queueing: view order');

    },
    queueing_viewProduct: function(id) {

        $('#main').html('queueing: view product');

    }
});
