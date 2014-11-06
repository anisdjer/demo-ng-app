/** 
 * dashboard.js
 * 
 * 
 * 
 * @author Anis Bouhachem <anis.bouhachem@tritux.com>
 * @since 17 sept. 2014
 */
(function () {
    'use strict';
    define(function(require) {
        var BaseController = require('controllers/base'), 
            DashboardCtrl = require('controllers/dashboard'),
            USER_ROLES     = require('constants/userRoles')
        ;
        var DashboardState = {
            url : '/dashboard',
            'views' :   {
                'mainView' : {
                    templateUrl : 'views/dashboard.html',
                    controller : DashboardCtrl 
                },
                'mainView2' : {
                    template : '<div class="col-lg-12"><h1>Test SUBVIEW 2</h1></div>',
                    controller : BaseController
                }
            },
            data :{
                access  : [USER_ROLES.ADMIN],
                page    : 'Dashboard'
            }
        };
        return DashboardState;
    });
})();