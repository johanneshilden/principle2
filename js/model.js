var Model = {

    getUsers: function(yield) {

        Storage.collection('user/all', 'users', yield);

    },

    getRoles: function(yield) {

        yield([
            'field-staff', 
            'call-center', 
            'driver', 
            'admin', 
            'depot-manager'
        ]);

    },

    getUsersByRole: function(role, yield) {

        if (typeof yield === 'undefined') {
            return _.partial(arguments.callee, arguments[0]);
        }

        Model.getRoles(function(roles) {

            if (!_.contains(roles, role)) {
                return App.error({
                    responseJSON: { message: 'Application error: "' + role + '" is not a valid user role.' }
                });
            }
    
            Model.getUsers(function(users) {
                yield(Model.filter(users, function(item) {
                    return item.role == role;
                }));
            });

        });
    },

    getUser: function(id, yield) {

        if (typeof yield === 'undefined') {
            return _.partial(arguments.callee, arguments[0]);
        }

        Model.getUsers(function(users) {
            Storage.find(id, users, yield);
        });

    },

    getAreaUsers: function(yield) {

        Storage.load('area-user', 'area-users', yield);

    },

    getAreasForCurrentUser: function(yield) {

        var user = App.user();

        Model.getAreaUsers(function(areaUsers) {

            var areas = [];
            _.each(areaUsers, function(item) {
                if (item.id === user.id) {
                    areas.push(item.areaId);
                }
            });

            yield(areas);

        });

    },

    getAreas: function(yield) {

        var resources = {
            areas     : 'area',
            areaUsers : 'area-user'
        };

        var decorator = function(resp) {

            var areas = Storage.toMap(resp.areas);

            _.each(areas, function(a) {
                a.fieldstaffUser = null;
                a.callcenterUser = null;
            });

            _.each(resp.areaUsers, function(au) {
                switch (au.role) {
                    case 'field-staff':
                        if (areas.hasOwnProperty(au.areaId)) {
                            areas[au.areaId].fieldstaffUser = au;
                        }
                        break;
                    case 'call-center':
                        if (areas.hasOwnProperty(au.areaId)) {
                            areas[au.areaId].callcenterUser = au;
                        }
                        break;
                }
            });

            return areas;

        };

        Storage.load(resources, 'areas', yield, decorator);

    },

    getAreasForRegion: function(regionId, yield) {

        if (typeof yield === 'undefined') {
            return _.partial(arguments.callee, arguments[0]);
        }

        Model.getAreas(function(areas) {
            yield(Model.filter(areas, function(item) {
                return item.regionId == regionId;
            }));
        });

    },

    getAreasForDepot: function(depotId, yield) {

        if (typeof yield === 'undefined') {
            return _.partial(arguments.callee, arguments[0]);
        }

        Model.getAreas(function(areas) {
            yield(Model.filter(areas, function(item) {
                return item.depotId == depotId;
            }));
        });

    },

    getArea: function(id, yield) {

        if (typeof yield === 'undefined') {
            return _.partial(arguments.callee, arguments[0]);
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
            return _.partial(arguments.callee, arguments[0]);
        }

        Model.getCustomers(function(customers) {
            Storage.find(id, customers, yield);
        });

    },

    getActivityForCustomer: function(customerId, yield) {

        if (typeof yield === 'undefined') {
            return _.partial(arguments.callee, arguments[0]);
        }

        Storage.load('activity/customer/' + customerId, 'activities-customer-' + customerId, yield);

    },

    getPriceCategories: function(yield) {

        Storage.collection('price-category', 'price-categories', yield);

    },

    getPriceCategory: function(id, yield) {

        if (typeof yield === 'undefined') {
            return _.partial(arguments.callee, arguments[0]);
        }

        Model.getPriceCategories(function(categories) {
            Storage.find(id, categories, yield);
        });

    },

    getDepots: function(yield) {
        Model.getUsers(function(users) {

            var managers = Model.filter(users, function(user) {
                return user.role == 'depot-manager';
            });

            var decorator = function(resp) {

                var depots = Storage.toMap(resp);
                
                _.each(managers, function(man) {
                    if (depots.hasOwnProperty(man.depotId)) {
                        depots[man.depotId].depotManager = man;
                    }
                });

                return depots;

            };

            Storage.load('depot', 'depots', yield, decorator);

        });
    },

    getDepot: function(id, yield) {

        if (typeof yield === 'undefined') {
            return _.partial(arguments.callee, arguments[0]);
        }

        Model.getDepots(function(depots) {
            Storage.find(id, depots, yield);
        });

    },
    
    getDepotsForRegion: function(regionId, yield) {

        if (typeof yield === 'undefined') {
            return _.partial(arguments.callee, arguments[0]);
        }

        Model.getDepots(function(depots) {
            yield(Model.filter(depots, function(depot) {
                return depot.regionId == regionId;
            }));
        });

    },

    getDepotForCurrentUser: function(yield) {
        Model.getUser(App.user().id, function(user) {
            var depotId = user.depotId;
            if (depotId) {
                yield(depotId);
            } else {
                App.error({
                    responseJSON: { message: 'No depot assigned to the current user. Please contact a system administrator.' }
                });
            }
        });
    },

    getRegions: function(yield) {

        Storage.collection('region', 'regions', yield);

    },

    getRegion: function(id, yield) {

        if (typeof yield === 'undefined') {
            return _.partial(arguments.callee, arguments[0]);
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

    getContactsForCustomer: function(customerId, yield) {

        if (typeof yield === 'undefined') {
            return _.partial(arguments.callee, arguments[0]);
        }

        Storage.load('contact/customer/' + customerId, 'contacts-customer-' + customerId, yield);

    },

    getContact: function(id, yield) {

        if (typeof yield === 'undefined') {
            return _.partial(arguments.callee, arguments[0]);
        }

        Storage.load('contact/' + id, 'contact-' + id, yield);

    },

    getComplaints: function(yield) {

        Storage.collection('complaint', 'complaints', yield);

    },

    getComplaint: function(id, yield) {

        if (typeof yield === 'undefined') {
            return _.partial(arguments.callee, arguments[0]);
        }

        Model.getComplaints(function(complaints) {
            Storage.find(id, complaints, yield);
        });

    },

    getDamageTypes: function(yield) {

        Storage.collection('stock-damage-type', 'stock-damage-types', yield);

    },

    getDamageType: function(id, yield) {

        if (typeof yield === 'undefined') {
            return _.partial(arguments.callee, arguments[0]);
        }

        Model.getDamageTypes(function(damageTypes) {
            Storage.find(id, damageTypes, yield);
        });

    },

    getVehicles: function(yield) {

        Storage.collection('vehicle', 'vehicles', yield);

    },

    getVehiclesForDepot: function(depotId, yield) {

        if (typeof yield === 'undefined') {
            return _.partial(arguments.callee, arguments[0]);
        }

        Model.getVehicles(function(vehicles) {
            yield(Model.filter(vehicles, function(item) {
                return item.depotId == depotId;
            }));
        });

    },

    getVehicle: function(id, yield) {

        if (typeof yield === 'undefined') {
            return _.partial(arguments.callee, arguments[0]);
        }

        Model.getVehicles(function(vehicles) {
            Storage.load('meter-reading/vehicle/' + id, 'meter-reading-' + id, function(result) {
                Storage.find(id, vehicles, function(item) {
                    item.meterReading = result.meterReading;
                    yield(item);
                });
            });
        });

    },

    getProducts: function(yield) {
    
        var resources = {
            products        : 'product',
            prices          : 'product-price',
            limits          : 'product-limit',
            priceCategories : 'price-category',
            weightClasses   : 'weight-category'
        };

        var decorator = function(resp) {

            var products = Storage.toMap(resp.products);

            _.each(products, function(product) {
                product['category'] = null;
                product['limit'] = null;
            });

            // Insert product prices
            _.each(resp.prices, function(item) {
                var a = products[item.productId]['category'] || {};
                a[item.priceCatId] = item;
                products[item.productId]['category'] = a;
            });
            
            // ... and load limits
            _.each(resp.limits, function(item) {
                var a = products[item.productId]['limit'] || {};
                a[item.categoryId] = item;
                products[item.productId]['limit'] = a;
            });
 
            // Flag products with incomplete price or load limit information
            _.each(products, function(product) {
                product.incomplete = false;
                _.each(resp.priceCategories, function(pc) {
                    if (!product.category || !product.category[pc.id]) {
                        product.incomplete = true;
                    }
                });
                _.each(resp.weightClasses, function(wc) {
                    if (!product.limit || !product.limit[wc.id]) {
                        product.incomplete = true;
                    }
                });
            });

            return products;

        };

        Storage.load(resources, 'products', yield, decorator);

    },

    getProductsInterval: function(interval, yield) {

        if (typeof yield === 'undefined') {
            return _.partial(arguments.callee, arguments[0]);
        }

        Model.getProducts(function(products) {
            yield(_.toArray(products).slice(interval[0] - 1, interval[1]));
        });

    },

    getProductsCount: function(yield) {

        Storage.load('count/product', 'products-count', yield);

    },

    getActiveProducts: function(yield) {

        Model.getProducts(function(products) {
            yield(Model.filter(products, function(item) {
                return item.deleted == false;
            }));
        });

    },

    getDeletedProducts: function(yield) {

        Model.getProducts(function(products) {
            yield(Model.filter(products, function(item) {
                return item.deleted == true;
            }));
        });

    },

    getProduct: function(id, yield) {

        if (typeof yield === 'undefined') {
            return _.partial(arguments.callee, arguments[0]);
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
            return _.partial(arguments.callee, arguments[0]);
        }

        Model.getWeightClasses(function(weightClasses) {
            Storage.find(id, weightClasses, yield);
        });

    },

    getMaintenanceTypes: function(yield) {

        Storage.collection('maintenance-activity-type', 'maintenance-types', yield);

    },

    getMaintenanceType: function(id, yield) {

        if (typeof yield === 'undefined') {
            return _.partial(arguments.callee, arguments[0]);
        }

        Model.getMaintenanceTypes(function(types) {
            Storage.find(id, types, yield);
        });

    },

    getOrders: function(yield) {

        Storage.collection('order', 'orders', yield);

    },

    getOrdersWithStatus: function(stat, yield) {

        if (typeof yield === 'undefined') {
            return _.partial(arguments.callee, arguments[0]);
        }

        Model.getOrders(function(orders) {
            yield(Model.filter(orders, function(item) {
                return item.status == stat;
            }));
        });

    },

    getOrdersForCustomer: function(customerId, yield) {

        if (typeof yield === 'undefined') {
            return _.partial(arguments.callee, arguments[0]);
        }

        Model.getOrders(function(orders) {
            yield(Model.filter(orders, function(item) {
                return item.customerId == customerId;
            }));
        });

    },

    getDispatches: function(yield) {

        Storage.collection('dispatch', 'dispatches', yield);

    },

    getOrderActivity: function(orderId, yield) {

        if (typeof yield === 'undefined') {
            return _.partial(arguments.callee, arguments[0]);
        }

        Storage.load('order-activity/' + orderId, 'order-activity-' + orderId, yield);

    },

    getOrderActivityForDispatch: function(dispatchId, yield) {

        if (typeof yield === 'undefined') {
            return _.partial(arguments.callee, arguments[0]);
        }

        Storage.load('order-activity/dispatch/' + dispatchId, 'order-activity-dispatch-' + dispatchId, yield);

    },

    getDispatch: function(id, yield) {

        if (typeof yield === 'undefined') {
            return _.partial(arguments.callee, arguments[0]);
        }

        Model.getDispatches(function(dispatches) {
            Storage.find(id, dispatches, function(dispatch) {
                Model.getOrderActivityForDispatch(id, function(orderActivity) {

                    dispatch.orderActivity = orderActivity;
                    yield(dispatch);

                });
            });
        });

    },

    getDispatchesWithStatus: function(stat, yield) {

        if (typeof yield === 'undefined') {
            return _.partial(arguments.callee, arguments[0]);
        }

        Model.getDispatches(function(disps) {
            yield(Model.filter(disps, function(item) {
                if (stat instanceof Array) {
                    return _.contains(stat, item.status);
                } else {
                    return item.status == stat;
                }
            }));
        });

    },

    getDispatchActivity: function(dispatchId, yield) {

        Storage.collection('dispatch/' + dispatchId + '/activity', 'activity-dispatch-' + dispatchId, yield);
        
    },

    getProductsForDispatch: function(dispatchId, yield) {

        Storage.load('product/dispatch/' + dispatchId, 'products-dispatch-' + dispatchId, yield);

    },

    getOrdersForDispatch: function(dispatchId, yield) {

        Storage.load('order/dispatch/' + dispatchId, 'orders-dispatch-' + dispatchId, yield);

    },

    getProductsForOrder: function(orderId, yield) {

        if (typeof yield === 'undefined') {
            return _.partial(arguments.callee, arguments[0]);
        }

        Storage.load('product/order/' + orderId, 'products-order-' + orderId, yield);

    },

    getStockForDepot: function(depotId, yield) {

        if (typeof yield === 'undefined') {
            return _.partial(arguments.callee, arguments[0]);
        }

        Storage.load('stock/depot/' + depotId, 'stock-' + depotId, yield);

    },

    getStockActivity: function(yield) {

        Storage.collection('stock-activity', 'stock-activity', yield);

    },

    getStockActivityForDepot: function(depotId, yield) {

        if (typeof yield === 'undefined') {
            return _.partial(arguments.callee, arguments[0]);
        }

        Model.getStockActivity(function(activity) {
            yield(Model.filter(activity, function(item) {
                return item.depotId == depotId;
            }));
        });

    },

    getFuelActivityForVehicle: function(vehicleId, yield) {

        if (typeof yield === 'undefined') {
            return _.partial(arguments.callee, arguments[0]);
        }

        Storage.load('fuel-activity/vehicle/' + vehicleId, 'fuel-data-' + vehicleId, yield);

    },

    getMaintenanceActivityForVehicle: function(vehicleId, yield) {

        if (typeof yield === 'undefined') {
            return _.partial(arguments.callee, arguments[0]);
        }

        Storage.load('maintenance-data/vehicle/' + vehicleId, 'maintenance-data-' + vehicleId, yield);

    },

    getTodaysTotalOrderValueForUser: function(userId, yield) {

        if (typeof yield === 'undefined') {
            return _.partial(arguments.callee, arguments[0]);
        }

        Storage.load('/performance/total-today/user/' + userId, 'total-sales-value', yield);

    },
    
    getTodaysCustomerCountForUser: function(userId, yield) {

        if (typeof yield === 'undefined') {
            return _.partial(arguments.callee, arguments[0]);
        }

        Storage.load('/performance/customer-count/user/' + userId, 'customer-count', yield);

    },
    getTodaysCommissionForUser: function(userId, yield) {

        if (typeof yield === 'undefined') {
            return _.partial(arguments.callee, arguments[0]);
        }

        Storage.load('/performance/commission-value/user/' + userId, 'commission-user', yield);

    },
    getOrderAverageForCustomer: function(customerId, yield) {

        if (typeof yield === 'undefined') {
            return _.partial(arguments.callee, arguments[0]);
        }

        Storage.load('/order-average/customer/' + customerId, 'order-average-' + customerId, yield);

    },
    getAverageOrderTimeInterval: function(customerId, yield) {

        if (typeof yield === 'undefined') {
            return _.partial(arguments.callee, arguments[0]);
        }

        Storage.load('/time-average/customer/' + customerId, 'time-average-' + customerId, yield);

    },
    getRoleCommissionValues: function(interval, yield) {

        if (typeof yield === 'undefined') {
            return _.partial(arguments.callee, arguments[0]);
        }

        var from = interval[0],
            to   = interval[1];

        Storage.collection('/role-commission/' + from + '/' + to, 'commission-values-' + from + '-' + to, yield);

    },
    readableRoleName: function(role) {
        switch (role) {
            case 'field-staff': 
                return 'Field Staff';
            case 'depot-manager': 
                return 'Depot Manager';
            case 'admin': 
                return 'Administrator';
            case 'call-center': 
                return 'Call Center';
            case 'driver': 
                return 'Driver';
            default:
                return 'Unknown';
        }
    },

    readableStockActType: function(type) {
        switch (type) {
            case 'adjustment_pos':
                return 'Stock Adjustment (+)';
            case 'adjustment_neg':
                return 'Stock Adjustment (-)';
            case 'incoming':
                return 'Incoming Stock';
            case 'damage':
                return 'Stock Damage';
            default:
                return 'Unknown';
          }
    },

    readableOrderStatus: function(stat) {
        switch (stat) {
            case 'queued':
                return 'Queued';
            case 'loading':
                return 'Loading';
            case 'loaded':
                return 'Loaded';
            case 'dispatched':
                return 'Dispatched';
            default:
                return stat;
          }
    },

    filter: function(objs, fun) {
        var res = {};
        for (key in objs) {
            var obj = objs[key];
            if (fun(obj)) {
                res[key] = obj; 
            }
        }
        return res;
    }

};
