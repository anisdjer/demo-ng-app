/** 
 * login.js
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
            LoginController = require('controllers/login'), 
            USER_ROLES     = require('constants/userRoles')
        ;
        var LoginState = {
            url : '/login',
            'views' :   {
                'mainView' : {
                    templateUrl : 'views/login.html',
                    controller : LoginController 
                },
                'mainView2' : {
                    template : '<div class="col-lg-12"><h1>Test SUBVIEW 2</h1></div>',
                    controller : BaseController
                }
            },
            data :{
                access  : [USER_ROLES.ADMIN] 
            }
        };
        return LoginState;
    });
})();