App.init({
    routes: {
        ""                            : "index",
        "queue"                       : "showQueue",
        "flush"                       : "emptyCache",
        "logout"                      : "logout",
        // -------------------------- :
        // area                       :
        // -------------------------- :
        "areas"                       : "showAreas",
        "area/edit/:id"               : "editArea",
        "area/delete/:id"             : "deleteArea",
        "area/create/region/:id"      : "createArea",
        // -------------------------- :
        // complaint                  :
        // -------------------------- :
        "complaints"                  : "showComplaints",
        "complaints/customer/:id"     : "showComplaintsForCustomer",
        "complaint/:id"               : "viewComplaint",
        // -------------------------- :
        // customer                   :
        // -------------------------- :
        "customers/area/:id"          : "showCustomersForArea",
        "customers"                   : "showCustomers",
        "customer/edit/:id"           : "editCustomer",
        "customer/create"             : "createCustomer",
        "customer/:id"                : "viewCustomer",
        // -------------------------- :
        // contact                    :
        // -------------------------- :
        "contact/customer/:id/create" : "createCustomerContact",
        "contact/:id/edit"            : "editCustomerContact",
        "contact/:id/delete"          : "deleteCustomerContact",
        // -------------------------- :
        // customer-call-activity     :
        // -------------------------- :
        "call-activity/customer/:id"  : "showCustomerCallActivity",
        // -------------------------- :
        // stock-damage               :
        // -------------------------- :
        "damage-types"                : "showDamageTypes",
        "damage-type/edit/:id"        : "editDamageType",
        "damage-type/delete/:id"      : "deleteDamageType",
        "damage-type/create"          : "createDamageType",
        // -------------------------- :
        // stock-activity             :
        // -------------------------- :
        "stock-activity"              : "showStockActivity",
        "stock-activity/depot/:id"    : "showStockActivityForDepot",
        // -------------------------- :
        // stock                      :
        // -------------------------- :
        "stock-management"            : "manageStock",
        "stock/depot/:id"             : "showStockForDepot",
        // -------------------------- :
        // depot                      :
        // -------------------------- :
        "depots"                      : "showDepots",
        "depots/region/:id"           : "showDepotsForRegion",
        "depot/edit/:id"              : "editDepot",
        "depot/delete/:id"            : "deleteDepot",
        "depot/create/region/:id"     : "createDepot",
        // -------------------------- :
        // driver                     :
        // -------------------------- :
        "driver-management"           : "manageDrivers",
        "driver/assign/vehicle/:id"   : "assignDriverToVehicle",
        // -------------------------- :
        // fuel                       :
        // -------------------------- :
        "fuel-management"             : "manageFuel",
        "fuel/log/vehicle/:id"        : "showFuelLogForVehicle",
        // -------------------------- :
        // maintenance                :
        // -------------------------- :
        "vehicle-maintenance"         : "manageVehicleMaintenance",
        "maintenance/vehicle/:id"     : "showMaintenanceForVehicle",
        // -------------------------- :
        // maintenance-activity-type  :
        // -------------------------- :
        "maintenance-types"           : "showMaintenanceActivityTypes",
        "maintenance-type/edit/:id"   : "editMaintenanceActivityType",
        "maintenance-type/delete/:id" : "deleteMaintenanceActivityType",
        "maintenance-type/create"     : "createMaintenanceActivityType",
        // -------------------------- :
        // product-price-category     :
        // -------------------------- :
        "price-categories"            : "showPriceCategories",
        "price-category/edit/:id"     : "editPriceCategory",
        "price-category/delete/:id"   : "deletePriceCategory",
        "price-category/create"       : "createPriceCategory",
        // -------------------------- :
        // product                    :
        // -------------------------- :
        "products"                    : "showProducts",
        "products/deleted"            : "showDeletedProducts",
        "product/edit/:id"            : "editProduct",
        "product/create"              : "createProduct",
        "product/:id"                 : "viewProduct",
        // -------------------------- :
        // region                     :
        // -------------------------- :
        "regions"                     : "showRegions",
        "region/edit/:id"             : "editRegion",
        "region/delete/:id"           : "deleteRegion",
        "region/create"               : "createRegion",
        "region/:id"                  : "viewRegion",
        // -------------------------- :
        // vehicle                    :
        // -------------------------- :
        "vehicles/depot/:id"          : "showVehiclesForDepot",
        "vehicles"                    : "showVehicles",
        "vehicle/edit/:id"            : "editVehicle",
        "vehicle/delete/:id"          : "deleteVehicle",
        "vehicle/:id"                 : "viewVehicle",
        // -------------------------- :
        // weight-category            :
        // -------------------------- :
        "weight-classes"              : "showWeightClasses",
        "weight-class/edit/:id"       : "editWeightClass",
        "weight-class/delete/:id"     : "deleteWeightClass",
        "weight-class/create"         : "createWeightClass",
        // -------------------------- :
        // user                       :
        // -------------------------- :
        "users"                       : "showUsers",
        "user/edit/:id"               : "editUser",
        "user/create"                 : "createUser",
        // -------------------------- :
        // commission                 :
        // -------------------------- :
        "commissions/edit"            : "editCommissionMatrix",
        // -------------------------- :
        // system                     :
        // -------------------------- :
        "system/activity"             : "showSystemActivityLog",
        // -------------------------- :
        //                            :
        // FIELDSTAFF                 :
        //                            :
        // -------------------------- :
        // customer                   :
        // -------------------------- :
        "fieldstaff/customers/all"    : "fieldstaff_showAllCustomers",
        "fieldstaff/customers"        : "fieldstaff_showCustomers",
        // -------------------------- :
        // order                      :
        // -------------------------- :
        "fieldstaff/orders"           : "fieldstaff_showOrders",
        // -------------------------- :
        // stock                      :
        // -------------------------- :
 
        // -------------------------- :
        // task                       :
        // -------------------------- :
 
        // -------------------------- :
        // performance                :
        // -------------------------- :
 
        // -------------------------- :
        // user                       :
        // -------------------------- :
 
        // -------------------------- :
        //                            :
        // DRIVER                     :
        //                            :
        // -------------------------- :

        // -------------------------- :
        //                            :
        // CALLCENTER                 :
        //                            :
        // -------------------------- :
        // customer                   :
        // -------------------------- :
        "!c/customers"                : "callcenter_showCustomers",
        "!c/location/customer/:id"    : "callcenter_viewCustomerLocation",
        "!c/tasks/customer/:id"       : "callcenter_viewTasksForCustomer",
        "!c/orders/customer/:id"      : "callcenter_viewOrdersForCustomer",
        "!c/complaints/customer/:id"  : "callcenter_viewComplaintsForCustomer",
        "!c/activity/customer/:id"    : "callcenter_viewActivityForCustomer",
        "!c/contacts/customer/:id"    : "callcenter_viewContactsForCustomer",
        "!c/customer/:id"             : "callcenter_viewCustomer",
        "!c/activity"                 : "callcenter_registerActivity",
        // -------------------------- :
        // order                      :
        // -------------------------- :
        "!c/orders/date/:date"        : "callcenter_showOrdersForDate",
        "!c/orders"                   : "callcenter_showOrders",
        "!c/order/edit/:id"           : "callcenter_editOrder",
        "!c/order/delete/:id"         : "callcenter_deleteOrder",
        "!c/order/:id"                : "callcenter_viewOrder",
        // -------------------------- :
        // product                    :
        // -------------------------- :
        "!c/price-list"               : "callcenter_showProducts",
        "!c/product/:id"              : "callcenter_viewProduct",
        // -------------------------- :
        // sidebar                    :
        // -------------------------- :
        "!c/sidebar/tasks"            : "callcenter_showTasks",
        "!c/sidebar/stock"            : "callcenter_showStockSummary",
        "!c/sidebar/calendar"         : "callcenter_showCalendar"
        // -------------------------- :
        //                            :
        // DEPOT MANAGEMENT           :
        //                            :
        // -------------------------- :

        // -------------------------- :
        //                            :
        // VEHICLE LOADING            :
        //                            :
        // -------------------------- :

    },
    index: function() {

        $('#main').html('#');

    },
    error: function() {

        $('#main').html('error');

    },
    offline: function() {

        $('#main').html('offline');

    },
    notify: function(msg) {

        $('#log').prepend('<li>' + msg + ' <a href="javascript:" class="note-dismiss">Dismiss</a></li>');

    },
    onRequestBegin: function() {

        $('#info').html('Loading...');

    },
    onRequestComplete: function() {

        $('#info').html('');

    },
    login: function() {

        T.render('admin/login', function(t) {
   
            var form = $('<form></form>');
            form.append(t());
            $('#main').html(form);
   
            form.validate({
                rules: {
                    user     : "required",
                    password : "required"
                },
                submitHandler: function(form) {
                    var user = form['user'].value;
                    var pass = form['password'].value;
   
                    var hash = CryptoJS.HmacSHA1(pass, $(document.body).data('key')).toString();
            
                    App.authenticate({
                        type     : 'GET',
                        resource : 'user/' + user + '/' + hash,
                        key      : 'user/' + user,
                        hash     : hash,
                        failure: function() {
                            App.notify('Authentication failed.');
                            alert('Login failed.');
                        }
                    });
   
                }
            });
   
        });

    },
    logout: function() {
        App.logout();
    },
    showQueue: function() {

        var queue = Storage.queue.get();
        for (key in queue) {
            queue[key]['index'] = key;
        }
        T.render('admin/queue', function(t) {

            $('#main').html(t({item: queue}));

            $('#main .item-process').click(function() {
                var index = $(this).data('id');
                Storage.queue.process(index, function() {
                    App.refresh();
                });
            });

            $('#main .item-remove').click(function() {
                var index = $(this).data('id');
                Storage.queue.remove(index);
                App.refresh();
            });

            $('#main button').click(function() {

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
    emptyCache: function() {
        store.clear();
        $('#main').html('Cache cleared.');
    },
    showAreas: function() {

        var resources = {
            area: {
                type     : 'GET',
                resource : 'area'
            }
        };

        Storage.load(resources, {
            success: function(resp, hit) {

                T.render('admin/area/index', function(t) {
                    $('#main').html(t({item: resp.area}));
                });

                if (!hit) {
                    // Insert collection into cache
                    _.each(resp.area, function(item) {
                        Storage.insert('area/' + item.id, item);
                    });
                }

            }
        });

    },
    editArea: function(id) {

        var resources = {
            area: {
                type     : 'GET',
                resource : 'area/' + id
            },
            fieldstaff: {
                type     : 'GET',
                resource : 'user/area/' + id + '/role/fieldstaff'
            },
            callcenter: {
                type     : 'GET',
                resource : 'user/area/' + id + '/role/callcenter'
            },
            users: {
                type     : 'GET',
                resource : 'user'
            }
        };

        Storage.load(resources, {
            success: function(resp) {
                T.render('admin/area/edit', function(t) {

                    var obj = resp.area;

                    obj.callcenter = [];
                    obj.fieldstaff = [];

                    // Organize users by role assignment.
                    _.each(resp.users, function(u) {
                        if (u.role == 'callcenter') {
                            obj.callcenter.push(u);
                        } else if (u.role == 'fieldstaff') {
                            obj.fieldstaff.push(u);
                        }
                    });

                    var form = $('<form></form>');
                    form.append(t(obj));
                    $('#main').html(form);

                    // Set fieldstaff and callcenter user in dropdown.
                    if (resp.callcenter.length == 1) {
                        $('#main select[name="callcenter-user"]').val(resp.callcenter[0].userId);
                    }
                    if (resp.fieldstaff.length == 1) {
                        $('#main select[name="fieldstaff-user"]').val(resp.fieldstaff[0].userId);
                    }

                    form.validate({
                        rules: {
                            "name": "required"
                        },
                        submitHandler: function(form) {

                            var obj = {
                                name     : form['name'].value,
                                depotId  : resp.area.depotId,
                                regionId : resp.area.regionId
                            };

                            var user = form['callcenter-user'].value;
                            if (user) {
                                obj.callcenterUser = user;
                            }
                            user = form['fieldstaff-user'].value;
                            if (user) {
                                obj.fieldstaffUser = user;
                            }

                            var req = {
                                type        : 'PUT',
                                resource    : '!area/' + id,
                                data        : obj,
                                description : 'Edit area "' + resp.area.name + '".',
                                purge       : [ 'area', 
                                                'area/' + id, 
                                                'user/area/' + id + '/role/fieldstaff', 
                                                'user/area/' + id + '/role/callcenter' ],
                                hint        : 'The area could not be updated: ',
                                feedback    : {
                                    'SQL_UNIQUE_CONSTRAINT_VIOLATION': 'An area with the provided name already exists in the same region.'
                                },
                                complete: function() {
                                    window.location.hash = 'areas';
                                }
                            };
    
                            Storage.process(req);

                        }
                    });

                });
            }
        });

    },
    deleteArea: function(id) {

        var resources = {
            area: {
                type     : 'GET',
                resource : 'area/' + id
            }
        };

        Storage.load(resources, {
            success: function(resp) {

                var area = resp.area;

                T.render('admin/area/delete', function(t) {
        
                    $('#main').html(t());
        
                    $('#main button.confirm').click(function() {
        
                        var req = {
                            type        : 'DELETE',
                            resource    : 'area/' + id,
                            data        : '',
                            description : 'Delete area "' + area.name + '".',
                            purge       : ['area', 'area/' + id],
                            hint        : 'Cannot delete area: ',
                            feedback    : {
                                'SQL_FOREIGN_KEY_CONSTRAINT_VIOLATION': 'This area still has assigned customers.'
                            },
                            complete: function() {
                                window.location.hash = 'areas';
                            }
                        };
        
                        Storage.process(req);
        
                    });
        
                });

            }
        });

    },
    createArea: function(id) {

        var resources = {
            depot: {
                type     : 'GET',
                resource : 'depot/region/' + id
            }
        };

        Storage.load(resources, {
            success: function(resp) {

                T.render('admin/area/create', function(t) {
        
                    var form = $('<form></form>');
                    form.append(t({depot: resp.depot}));
                    $('#main').html(form);
        
                    form.validate({
                        rules: {
                            "name": "required"
                        },
                        submitHandler: function(form) {
        
                            var obj = {
                                name     : form['name'].value,
                                depotId  : form['depot'].value, 
                                regionId : id
                            };

                            var req = {
                                type        : 'POST',
                                resource    : 'area',
                                data        : obj,
                                description : 'Create a new area named "' + obj.name + '".',
                                purge       : 'area',
                                hint        : 'The area could not be created: ',
                                feedback    : {
                                    'SQL_UNIQUE_CONSTRAINT_VIOLATION': 'An area with the provided name already exists in the same region.'
                                },
                                complete: function() {
                                    window.location.hash = 'areas';
                                }
                            };
            
                            Storage.process(req);
        
                        }
                    });
         
                });

            }
        });

    },
    showComplaints: function() {

//        Storage.get({
//            resource: 'complaint',
//            template: 'admin/complaint/index',
//            callback: function() {
//                return { item: this.complaint };
//            }
//        });

        var resources = {
            complaint: {
                type     : 'GET',
                resource : 'complaint'
            }
        };

        Storage.load(resources, {
            success: function(resp, hit) {

                T.render('admin/complaint/index', function(t) {
                    $('#main').html(t({item: resp.complaint}));
                });

                if (!hit) {
                    // Insert collection into cache
                    _.each(resp.complaint, function(item) {
                        Storage.insert('complaint/' + item.id, item);
                    });
                }

            }
        });

    },
    showComplaintsForCustomer: function(id) {

        var resources = {
            complaint: {
                type     : 'GET',
                resource : 'complaint/customer/' + id
            },
            customer: {
                type     : 'GET',
                resource : 'customer/' + id
             }
        };

        Storage.load(resources, {
            success: function(resp, hit) {

                var obj = resp.customer;
                obj.item = resp.complaint;

                T.render('admin/complaint/customer', function(t) {
                    $('#main').html(t(obj));
                });

                if (!hit) {
                    // Insert collection into cache
                    _.each(resp.complaint, function(item) {
                        Storage.insert('complaint/' + item.id, item);
                    });
                }
    
            }
        });

    },
    viewComplaint: function(id) {

        var resources = {
            complaint: {
                type     : 'GET',
                resource : 'complaint/' + id
            }
        };

        Storage.load(resources, {
            success: function(resp) {

                var complaint = resp.complaint;

                T.render('admin/complaint/view', function(t) {

                    $('#main').html(t(resp.complaint));

                    $('#main button.resolve').click(function() {

                        var req = {
                            type        : 'PATCH',
                            resource    : 'complaint/resolve/' + id,
                            data        : '',
                            description : 'Resolve complaint with id #' + id + '.',
                            purge       : [ 'complaint', 
                                            'complaint/' + id, 
                                            'complaint/customer/' + complaint.customerId ],
                            complete: function() {
                                App.refresh();
                            }
                        };
        
                        Storage.process(req);

                    });

                });
            }
        });

    },
    showCustomersForArea: function(id) {

        var resources = {
            customer: {
                type     : 'GET',
                resource : 'customer/area/' + id
            }
        };

        Storage.load(resources, {
            success: function(resp, hit) {

                T.render('admin/customer/index', function(t) {
                    $('#main').html(t({response: resp.customer}));
                });

                if (!hit) {
                    // Insert customers into cache
                    _.each(resp.customer, function(item) {
                        Storage.insert('customer/' + item.id, item);
                        // Aggressive caching
                        Storage.load('contact/customer/' + item.id);
                    });
                }

            }
        });

    },
    showCustomers: function() {

        var resources = {
            customer: {
                type     : 'GET',
                resource : 'customer'
            }
        };

        Storage.load(resources, {
            success: function(resp, hit) {

                T.render('admin/customer/index', function(t) {
                    $('#main').html(t({response: resp.customer}));
                });

                if (!hit) {
                    // Insert customers into cache
                    _.each(resp.customer, function(item) {
                        Storage.insert('customer/' + item.id, item);
                        // Aggressive caching
                        Storage.load('contact/customer/' + item.id);
                    });
                }

            }
        });

    },
    editCustomer: function(id) {

        var resources = {
            customer: {
                type     : 'GET',
                resource : 'customer/' + id
            },
            area: {
                type     : 'GET',
                resource : 'area'
            },
            priceCategory: {
                type     : 'GET',
                resource : 'price-category'
            }
        };

        Storage.load(resources, {
            success: function(resp) {

                T.render('admin/customer/edit', function(t) {

                    var obj = resp.customer;
                    obj.priceCategory = resp.priceCategory;
                    obj.area = resp.area;
    
                    var form = $('<form></form>');
                    form.append(t(obj));
                    $('#main').html(form);
           
                    $('#main select[name="area"]').val(obj.areaId);
                    $('#main select[name="price-category"]').val(obj.priceCatId);

                    form.validate({
                        rules: {
                            name          : "required",
                            latitude      : "required number",
                            longitude     : "required number",
                            tin           : "required",
                            phone         : "required",
                            streetAddress : "required"
                        },
                        submitHandler: function(form) {

                            var obj = {
                                name          : form['name'].value,
                                latitude      : form['latitude'].value,
                                longitude     : form['longitude'].value,
                                tin           : form['tin'].value,
                                phone         : form['phone'].value,
                                streetAddress : form['street-address'].value,
                                isActive      : form['is_active'].checked,
                                areaId        : form['area'].value,
                                priceCatId    : form['price-category'].value
                            };
         
                            var req = {
                                type        : 'PUT',
                                resource    : 'customer/' + id,
                                data        : obj,
                                description : 'Update customer "' + obj.name + '".',
                                purge       : ['customer', 'customer/' + id],
                                complete: function() {
                                    window.location.hash = 'customers';
                                }
                            };
            
                            Storage.process(req);
 
                        }
                    });

                });
            }
        });

    },
    createCustomer: function() {

        var resources = {
            area: {
                type     : 'GET',
                resource : 'area'
            },
            priceCategory: {
                type     : 'GET',
                resource : 'price-category'
            }
        };

        Storage.load(resources, {
            success: function(resp) {

                T.render('admin/customer/create', function(t) {

                    var obj = {
                        priceCategory : resp.priceCategory,
                        area          : resp.area
                    };
 
                    var form = $('<form></form>');
                    form.append(t(obj));
                    $('#main').html(form);
        
                    form.validate({
                        rules: {
                            name          : "required",
                            latitude      : "required number",
                            longitude     : "required number",
                            tin           : "required",
                            phone         : "required",
                            streetAddress : "required"
                        },
                        submitHandler: function(form) {

                            var obj = {
                                name          : form['name'].value,
                                latitude      : form['latitude'].value,
                                longitude     : form['longitude'].value,
                                tin           : form['tin'].value,
                                phone         : form['phone'].value,
                                streetAddress : form['street-address'].value,
                                isActive      : form['is_active'].checked,
                                areaId        : form['area'].value,
                                priceCatId    : form['price-category'].value
                            };
         
                            var req = {
                                type        : 'POST',
                                resource    : 'customer',
                                data        : obj,
                                description : 'Create customer "' + obj.name + '".',
                                purge       : ['customer'],
                                complete: function() {
                                    window.location.hash = 'customers';
                                }
                            };
            
                            Storage.process(req);
 
                        }
                    });

                });
            }
        });

    },
    viewCustomer: function(id) {

        var resources = {
            customer: {
                type     : 'GET',
                resource : 'customer/' + id
            },
            contact: {
                type     : 'GET',
                resource : 'contact/customer/' + id
            }
        };

        Storage.load(resources, {
            success: function(resp, hit) {

                var obj = resp.customer;
                obj.contact = resp.contact;

                T.render('admin/customer/view', function(t) {
                    $('#main').html(t(obj));
                });

                if (!hit) {
                    // Insert contacts into cache
                    _.each(resp.contact, function(item) {
                        Storage.insert('contact/' + item.id, item);
                    });
                }

            }
        });

    },
    createCustomerContact: function(id) {

        var resources = {
            customer: {
                type     : 'GET',
                resource : 'customer/' + id 
            }
        };

        Storage.load(resources, {
            success: function(resp) {

                var customer = resp.customer;

                T.render('admin/contact/create', function(t) {
        
                    var types = {
                        'physical-address' : 'Physical Address',
                        'po-box-address'   : 'PO Box Address',
                        'landline-phone'   : 'Landline Phone Number',
                        'mobile-phone'     : 'Mobile Phone Number',
                        'email-address'    : 'Email Address'
                    };
        
                    var form = $('<form></form>');
                    form.append(t({contactType: types}));
                    $('#main').html(form);
        
                    form.validate({
                        rules: {
                            "kind" : "required",
                            "body" : "required"
                        },
                        submitHandler: function(form) {
        
                            var obj = {
                                customerId : id,
                                kind       : form['kind'].value,
                                body       : form['body'].value, 
                                meta       : form['meta'].value
                            };
        
                            var req = {
                                type        : 'POST',
                                resource    : 'contact',
                                data        : obj,
                                description : 'Create a new customer contact for customer "' + customer.name + '".',
                                purge       : 'contact/customer/' + id,
                                hint        : 'The customer contact could not be created: ',
                                complete: function() {
                                    window.location.hash = 'customer/' + id;
                                }
                            };
            
                            Storage.process(req);
        
                        }
                    });
         
                });

            }
        });

    },
    editCustomerContact: function(id) {

        var types = {
            'physical-address' : 'Physical Address',
            'po-box-address'   : 'PO Box Address',
            'landline-phone'   : 'Landline Phone Number',
            'mobile-phone'     : 'Mobile Phone Number',
            'email-address'    : 'Email Address'
        };

        var resources = {
            contact: {
                type     : 'GET',
                resource : 'contact/' + id
            }
        };

        Storage.load(resources, {
            success: function(resp) {

                var contact = resp.contact;
                contact.contactType = types;

                var customerId = contact.customerId;

                var resources = {
                    customer: {
                        type     : 'GET',
                        resource : 'customer/' + customerId
                    }
                };

                Storage.load(resources, {
                    success: function(resp) {

                        var customer = resp.customer;

                        T.render('admin/contact/edit', function(t) {
        
                            var form = $('<form></form>');
                            form.append(t(contact));
                            $('#main').html(form);
        
                            $('#main select[name="kind"]').val(contact.kind);
                
                            form.validate({
                                rules: {
                                    "kind"  : "required",
                                    "body"  : "required"
                                },
                                submitHandler: function(form) {
                
                                    var obj = {
                                        customerId : customerId,
                                        kind       : form['kind'].value,
                                        body       : form['body'].value, 
                                        meta       : form['meta'].value
                                    };
                
                                    var req = {
                                        type        : 'PUT',
                                        resource    : 'contact/' + id,
                                        data        : obj,
                                        description : 'Edit customer contact for customer "' + customer.name + '".',
                                        purge       : ['contact/' + id, 'contact/customer/' + customerId],
                                        hint        : 'The customer contact could not be updated: ',
                                        complete: function() {
                                            window.location.hash = 'customer/' + customerId;
                                        }
                                    };
                    
                                    Storage.process(req);
                
                                }
                            });
             
                        });

                    }
                });

            }
        });
        
    },
    deleteCustomerContact: function(id) {

        $('#main').html('deleteCustomerContact');
        
    },
    showCustomerCallActivity: function(id) {

        $('#main').html('showCustomerCallActivity');

    },
    showDamageTypes: function() {

        var resources = {
            damageType: {
                type     : 'GET',
                resource : 'stock-damage-type'
            }
        };

        Storage.load(resources, {
            success: function(resp, hit) {

                T.render('admin/stock-damage-type/index', function(t) {
                    $('#main').html(t({item: resp.damageType}));
                });

                if (!hit) {
                    // Insert collection into cache
                    _.each(resp.damageType, function(item) {
                        Storage.insert('stock-damage-type/' + item.id, item);
                    });
                }

            }
        });

    },
    editDamageType: function(id) {

        var resources = {
            damageType: {
                type     : 'GET',
                resource : 'stock-damage-type/' + id
            }
        };

        Storage.load(resources, {
            success: function(resp) {

                var stockDamageType = resp.damageType;

                T.render('admin/stock-damage-type/edit', function(t) {

                    var form = $('<form></form>');
                    form.append(t(resp.damageType));
                    $('#main').html(form);
           
                    form.validate({
                        rules: {
                            "name": "required"
                        },
                        submitHandler: function(form) {
        
                            var obj = {
                                name: form['name'].value
                            };
        
                            var req = {
                                type        : 'PUT',
                                resource    : 'stock-damage-type/' + id,
                                data        : obj,
                                description : 'Update a stock damage type named "' + stockDamageType.name + '".',
                                purge       : ['stock-damage-type', 'stock-damage-type/' + id],
                                hint        : 'The stock damage type could not be updated: ',
                                feedback    : {
                                    'SQL_UNIQUE_CONSTRAINT_VIOLATION': 'A stock damage type with the name "' + obj.name + '" already exists.'
                                },
                                complete: function() {
                                    window.location.hash = 'damage-types';
                                }
                            };
            
                            Storage.process(req);
        
                        }
                    });

                });
            }
        });

    },
    deleteDamageType: function(id) {

        var resources = {
            damageType: {
                type     : 'GET',
                resource : 'stock-damage-type/' + id
            }
        };

        Storage.load(resources, {
            success: function(resp) {

                var damageType = resp.damageType;

                T.render('admin/stock-damage-type/delete', function(t) {
        
                    $('#main').html(t());
        
                    $('#main button.confirm').click(function() {
        
                        var req = {
                            type        : 'DELETE',
                            resource    : 'stock-damage-type/' + id,
                            data        : '',
                            description : 'Delete stock damage type "' + damageType.name + '".',
                            purge       : ['stock-damage-type', 'stock-damage-type/' + id],
                            hint        : 'Cannot delete stock damage type: ',
                            complete: function() {
                                window.location.hash = 'damage-types';
                            }
                        };
        
                        Storage.process(req);
        
                    });
        
                });

            }
        });

    },
    createDamageType: function() {

        T.render('admin/stock-damage-type/create', function(t) {

            var form = $('<form></form>');
            form.append(t());
            $('#main').html(form);

            form.validate({
                rules: {
                    "name": "required"
                },
                submitHandler: function(form) {

                    var obj = {
                        name: form['name'].value
                    };

                    var req = {
                        type        : 'POST',
                        resource    : 'stock-damage-type',
                        data        : obj,
                        description : 'Create a new stock damage type named "' + obj.name + '".',
                        purge       : 'stock-damage-type',
                        hint        : 'The stock damage type could not be created: ',
                        feedback    : {
                            'SQL_UNIQUE_CONSTRAINT_VIOLATION': 'A stock damage type with the name "' + obj.name + '" already exists.'
                        },
                        complete: function() {
                            window.location.hash = 'damage-types';
                        }
                    };
    
                    Storage.process(req);

                }
            });
 
        });

    },
    showStockActivity: function() {

        $('#main').html('showStockActivity');

    },
    showStockActivityForDepot: function(id) {

        $('#main').html('showStockActivityForDepot');

    },
    manageStock: function() {

        var resources = {
            depot: {
                type     : 'GET',
                resource : 'depot'
            }
        };

        Storage.load(resources, {
            success: function(resp, hit) {

                T.render('admin/stock/depots', function(t) {
                    $('#main').html(t({item: resp.depot}));
                });

                if (!hit) {
                    // Insert depots into cache
                    _.each(resp.depot, function(item) {
                        Storage.insert('depot/' + item.id, item);
                    });
                }

            }
        });

    },
    showStockForDepot: function(id) {
        
        var resources = {
            stock: {
                type     : 'GET',
                resource : 'stock/depot/' + id
            }
        };

        Storage.load(resources, {
            success: function(resp) {
                T.render('admin/stock/summary', function(t) {
                    $('#main').html(t({item: resp.stock}));
                });
            }
        });

    },
    showDepots: function() {

        var resources = {
            depot: {
                type     : 'GET',
                resource : 'depot'
            }
        };

        Storage.load(resources, {
            success: function(resp, hit) {
                
                T.render('admin/depot/index', function(t) {
                    $('#main').html(t({item: resp.depot}));
                });

                if (!hit) {
                    // Insert depots into cache
                    _.each(resp.depot, function(item) {
                        Storage.insert('depot/' + item.id, item);
                    });
                }

            }
        });

    },
    showDepotsForRegion: function(id) {

        var resources = {
            depot: {
                type     : 'GET',
                resource : 'depot/region/' + id
            }
        };

        Storage.load(resources, {
            success: function(resp, hit) {

                T.render('admin/depot/index', function(t) {
                    $('#main').html(t({item: resp.depot}));
                });

                if (!hit) {
                    // Insert depots into cache
                    _.each(resp.depot, function(item) {
                        Storage.insert('depot/' + item.id, item);
                    });
                }
    
            }
        });

    },
    editDepot: function(id) {

        $('#main').html('editDepot');

    },
    deleteDepot: function(id) {

        $('#main').html('deleteDepot');

    },
    createDepot: function() {

        $('#main').html('createDepot');

    },
    manageDrivers: function() {

        $('#main').html('driverManagement');

    },
    assignDriverToVehicle: function() {

        $('#main').html('assignDriverToVehicle');

    },
    manageFuel: function() {

        $('#main').html('fuelManagement');

    },
    showFuelLogForVehicle: function(id) {

        $('#main').html('showFuelLogForVehicle');

    },
    manageVehicleMaintenance: function() {

        $('#main').html('showMaintenance');

    },
    showMaintenanceForVehicle: function(id) {

        $('#main').html('showMaintenanceForVehicle');

    },
    showMaintenanceActivityTypes: function() {

        var resources = {
            activityType: {
                type     : 'GET',
                resource : 'maintenance-activity-type'
            }
        };

        Storage.load(resources, {
            success: function(resp) {
                T.render('admin/maintenance-activity-type/index', function(t) {
                    $('#main').html(t({item: resp.activityType}));
                });
            }
        });

    },
    editMaintenanceActivityType: function(id) {

        $('#main').html('editMaintenanceActivityType');

    },
    deleteMaintenanceActivityType: function(id) {

        $('#main').html('deleteMaintenanceActivityType');

    },
    createMaintenanceActivityType: function() {

        $('#main').html('createMaintenanceActivityType');

    },
    showPriceCategories: function() {

        var resources = {
            priceCategory: {
                type     : 'GET',
                resource : 'price-category'
            }
        };

        Storage.load(resources, {
            success: function(resp) {
                T.render('admin/price-category/index', function(t) {
                    $('#main').html(t({item: resp.priceCategory}));
                });
            }
        });

    },
    editPriceCategory: function(id) {

        $('#main').html('editPriceCategory');

    },
    deletePriceCategory: function(id) {

        $('#main').html('deletePriceCategory');

    },
    createPriceCategory: function() {

        $('#main').html('createPriceCategory');

    },
    showProducts: function() {

        var resources = {
            product: {
                type     : 'GET',
                resource : 'product'
            }
        };

        Storage.load(resources, {
            success: function(resp) {

                var ids = [];
                _.each(resp.product, function(p) {
                    ids.push(p.id);
                });

                var resources = {
                    productPrice: {
                        type     : 'POST',
                        resource : 'product-price/products',
                        data     : { products: ids }
                    },
                    priceCategory: {
                        type     : 'GET',
                        resource : 'price-category'
                    }
                };

                // Build dictionary
                var dict = {};
                _.each(resp.product, function(p) {
                    dict[p.id] = p;
                });

                Storage.load(resources, {
                    success: function(resp) {

                        _.each(resp.productPrice, function(p) {
                            var a = dict[p.productId]['category'] || [];
                            a.push({price: p.price});
                            dict[p.productId]['category'] = a;
                        });

                        T.render('admin/product/index', function(t) {
                            $('#main').html(t({category: resp.priceCategory, item: dict}));

                            $('#main .product-delete').click(function() {
        
                                var id = $(this).data('id');
        
                                var req = {
                                    type        : 'PATCH',
                                    resource    : 'product/' + id,
                                    data        : { deleted: true },
                                    description : 'Delete product with id #' + id + '.',
                                    purge       : ['product', 'product/' + id, 'product/deleted', 'product-price/products'],
                                    complete: function() {
                                        window.location.hash = 'products/deleted';
                                    }
                                };
                
                                Storage.process(req);
        
                            });

                        });

                    }
                });

            }
        });

    },
    showDeletedProducts: function() {

        var resources = {
            product: {
                type     : 'GET',
                resource : 'product/deleted'
            }
        };

        Storage.load(resources, {
            success: function(resp) {

                T.render('admin/product/deleted', function(t) {
                    $('#main').html(t({item: resp.product}));

                    $('#main .product-recover').click(function() {

                        var id = $(this).data('id');

                        var req = {
                            type        : 'PATCH',
                            resource    : 'product/' + id,
                            data        : { deleted: false },
                            description : 'Recover product with id #' + id + '.',
                            purge       : ['product', 'product/' + id, 'product/deleted', 'product-price/products'],
                            complete: function() {
                                window.location.hash = 'products';
                            }
                        };
        
                        Storage.process(req);

                    });

                });

            }
        });

    },
    editProduct: function(id) {

        var resources = {
            product: {
                type     : 'GET',
                resource : 'product/' + id
            }
        };

        Storage.load(resources, {
            success: function(resp) {

                // ...

                T.render('admin/product/edit', function(t) {
                    $('#main').html(t(resp.product));
                });


            }
        });

        // ... 

    },
    createProduct: function() {

        var resources = {
            priceCategory: {
                type     : 'GET',
                resource : 'price-category'
            },
            weightCategory: {
                type     : 'GET',
                resource : 'weight-category'
            }
        };

        Storage.load(resources, {
            success: function(resp) {

                T.render('admin/product/create', function(t) {
    
                    var form = $('<form></form>');

                    form.append(t({
                        priceCategory  : resp.priceCategory,
                        weightCategory : resp.weightCategory
                    }));

                    $('#main').html(form);
    
                    var rules = {
                        "name"        : "required",
                        "unit-size"   : "required",
                        "description" : "required"
                    };

                    // Add validation rules for each price item
                    _.each(resp.priceCategory, function(c) {
                        rules['price-' + c.id] = "required number";
                    });
                    
                    // Add validation rules for each load limit
                    _.each(resp.weightCategory, function(c) {
                        rules['limit-' + c.id] = "required digits";
                    });

                    form.validate({
                        rules: rules,
                        submitHandler: function(form) {

                            var limits = [];
                            var prices = [];

                            _.each($('input[name^="limit"]'), function(el) {
                                limits.push({
                                    weightCatId: $(el).data('id'),
                                    limit: el.value
                                });
                            });

                            _.each($('input[name^="price"]'), function(el) {
                                prices.push({
                                    priceCatId: $(el).data('id'),
                                    price: el.value
                                });
                            });

                            var obj = {
                                name        : form['name'].value,
                                unitSize    : form['unit-size'].value,
                                description : form['description'].value,
                                limits      : limits,
                                prices      : prices
                            };
    
                            var req = {
                                type        : 'POST',
                                resource    : '!product',
                                data        : obj,
                                description : 'Create a new product.',
                                purge       : 'product',
                                hint        : 'The product could not be created: ',
                                complete: function() {
                                    window.location.hash = 'products';
                                }
                            };
            
                            Storage.process(req);

                        }
                    });
         
                });

            }
        });

    },
    viewProduct: function(id) {

        var resources = {
            product: {
                type     : 'GET',
                resource : 'product/' + id
            }
        };

        Storage.load(resources, {
            success: function(resp) {
                T.render('admin/product/view', function(t) {
                    $('#main').html(t(resp.product));
                });
            }
        });

    },
    showRegions: function() {

        var resources = {
            region: {
                type     : 'GET',
                resource : 'region'
            }
        };

        Storage.load(resources, {
            success: function(resp, hit) {
                T.render('admin/region/index', function(t) {

                    $('#main').html(t({item: resp.region}));

                    if (!hit) {
                        // Insert regions into cache
                        _.each(resp.region, function(item) {
                            Storage.insert('region/' + item.id, item);
                        });
                    }

                });
            }
        });

    },
    editRegion: function(id) {

        var resources = {
            region: {
                type     : 'GET',
                resource : 'region/' + id
            }
        };

        Storage.load(resources, {
            success: function(resp) {
 
                T.render('admin/region/edit', function(t) {
        
                    var form = $('<form></form>');
                    form.append(t(resp.region));
                    $('#main').html(form);

                    form.validate({
                        rules: {
                            "name": "required"
                        },
                        submitHandler: function(form) {

                            var obj = {
                                name: form['name'].value
                            };

                            var req = {
                                type        : 'PUT',
                                resource    : 'region/' + id,
                                data        : obj,
                                description : 'Edit region "' + resp.region.name + '".',
                                purge       : ['region', 'region/' + id],
                                hint        : 'The region could not be updated: ',
                                feedback    : {
                                    'SQL_UNIQUE_CONSTRAINT_VIOLATION': 'A region with the provided name already exists.'
                                },
                                complete: function() {
                                    window.location.hash = 'regions';
                                }
                            };
    
                            Storage.process(req);

                        }
                    });
        
                });
            }
        });

    },
    deleteRegion: function(id) {

        $('#main').html('deleteRegion');

    },
    createRegion: function() {

        T.render('admin/region/create', function(t) {

            var form = $('<form></form>');
            form.append(t());
            $('#main').html(form);

            form.validate({
                rules: {
                    "name": "required"
                },
                submitHandler: function(form) {

                    var obj = {
                        name: form['name'].value
                    };

                    var req = {
                        type        : 'POST',
                        resource    : 'region',
                        data        : obj,
                        description : 'Create a new region named "' + obj.name + '".',
                        purge       : 'region',
                        hint        : 'The region could not be created: ',
                        feedback    : {
                            'SQL_UNIQUE_CONSTRAINT_VIOLATION': 'A region with the name "' + obj.name + '" already exists.'
                        },
                        complete: function() {
                            window.location.hash = 'regions';
                        }
                    };
    
                    Storage.process(req);

                }
            });
 
        });

    },
    viewRegion: function(id) {

        var resources = {
            region: {
                type     : 'GET',
                resource : 'region/' + id
            }
        };

        Storage.load(resources, {
            success: function(resp) {
                T.render('admin/region/view', function(t) {
                    $('#main').html(t(resp.region));
                });
            }
        });

    },
    showVehiclesForDepot: function(id) {

        $('#main').html('showVehiclesForDepot');

    },
    showVehicles: function() {

        var resources = {
            vehicle: {
                type     : 'GET',
                resource : 'vehicle'
            }
        };

        Storage.load(resources, {
            success: function(resp) {
                T.render('admin/vehicle/index', function(t) {
                    $('#main').html(t({item: resp.vehicle}));
                });
            }
        });

    },
    editVehicle: function(id) {

        $('#main').html('editVehicle');

    },
    deleteVehicle: function(id) {

        $('#main').html('deleteVehicle');

    },
    viewVehicle: function(id) {

        $('#main').html('viewVehicle');

    },
    showWeightClasses: function() {

        var resources = {
            weightClass: {
                type     : 'GET',
                resource : 'weight-category'
            }
        };

        Storage.load(resources, {
            success: function(resp) {
                T.render('admin/weight-category/index', function(t) {
                    $('#main').html(t({item: resp.weightClass}));
                });
            }
        });

    },
    editWeightClass: function(id) {

        var resources = {
            weightClass: {
                type     : 'GET',
                resource : 'weight-category/' + id
            }
        };

        Storage.load(resources, {
            success: function(resp) {
                T.render('admin/weight-category/edit', function(t) {

                    var form = $('<form></form>');
                    form.append(t(resp.weightClass));
                    $('#main').html(form);
        
                    form.validate({
                        rules: {
                            "name": "required"
                        },
                        submitHandler: function(form) {

                            var obj = {
                                name: form['name'].value
                            };

                            var req = {
                                type        : 'PUT',
                                resource    : 'weight-category/' + id,
                                data        : obj,
                                description : 'Edit vehicle weight class "' + resp.weightClass.name + '".',
                                purge       : ['weight-category', 'weight-category/' + id],
                                hint        : 'The weight class could not be updated: ',
                                feedback    : {
                                    'SQL_UNIQUE_CONSTRAINT_VIOLATION': 'A vehicle weight class with the provided name already exists.'
                                },
                                complete: function() {
                                    window.location.hash = 'weight-classes';
                                }
                            };
    
                            Storage.process(req);

                        }
                    });

                });
            }
        });

    },
    deleteWeightClass: function(id) {

        $('#main').html('deleteWeightClass');

    },
    createWeightClass: function() {

        $('#main').html('createWeightClass');

    },
    showUsers: function() {

        var resources = {
            user: {
                type     : 'GET',
                resource : 'user'
            }
        };

        Storage.load(resources, {
            success: function(resp) {
                T.render('admin/user/index', function(t) {
                    $('#main').html(t({item: resp.user}));
                });
            }
        });

    },
    editUser: function(id) {

        $('#main').html('editUser');

    },
    createUser: function() {

        $('#main').html('createUser');

    },
    editCommissionMatrix: function() {

        $('#main').html('editCommissionMatrix');

    },
    showSystemActivityLog: function() {

        $('#main').html('showSystemActivity');

    },
    fieldstaff_showCustomers: function() {

        $('#main').html('customers');

    },
    fieldstaff_showAllCustomers: function() {

        $('#main').html('all customers');

    },
    fieldstaff_showOrders: function() {

        $('#main').html('orders');

    },
    callcenter_showCustomers: function() {

        $('#main').html('showcustomers');

    },
    callcenter_viewCustomerLocation: function(id) {

        $('#main').html('viewcustomerlocation');

    },
    callcenter_viewTasksForCustomer: function(id) {

        $('#main').html('tasksforcustomer');

    },
    callcenter_viewOrdersForCustomer: function(id) {

        $('#main').html('vieworders');

    },
    callcenter_viewComplaintsForCustomer: function(id) {

        $('#main').html('viewcomplaints');

    },
    callcenter_viewActivityForCustomer: function(id) {

        $('#main').html('viewactivity');

    },
    callcenter_viewContactsForCustomer: function(id) {

        $('#main').html('contacts');

    },
    callcenter_viewCustomer: function(id) {

        $('#main').html('view customer');

    },
    callcenter_registerActivity: function(id) {

        $('#main').html('register activity');

    },
    callcenter_showOrdersForDate: function() {

        $('#main').html('showordersfordate');

    },
    callcenter_showOrders: function() {

        $('#main').html('showorders');

    },
    callcenter_editOrder: function(id) {

        $('#main').html('editorder');

    },
    callcenter_deleteOrder: function(id) {

        $('#main').html('deleteorder');

    },
    callcenter_viewOrder: function(id) {

        $('#main').html('view order');

    },
    callcenter_showTasks: function() {

        $('#main').html('showtasks');

    },
    callcenter_showProducts: function() {

        $('#main').html('showproducts');

    },
    callcenter_viewProduct: function(id) {

        $('#main').html('view product');

    },
    callcenter_showTasks: function() {

        $('#main').html('showtasks');

    },
    callcenter_showStockSummary: function() {

        $('#main').html('stocksummary');

    },
    callcenter_showCalendar: function() {

        $('#main').html('calendar');

    }
});
