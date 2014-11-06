/** 
 * profile.js
 * 
 * 
 * 
 * @author Anis Bouhachem <anis.bouhachem@tritux.com>
 * @since 18 sept. 2014
 */
(function () {
    'use strict';
    define(function(require) {
        var BaseController = require('controllers/base'),
            HomeController = require('controllers/home'),
            USER_ROLES     = require('constants/userRoles')
        ;
        var ProfileState = {
            url : '/home',
            'views' :   {
                'mainView' : {
                    templateUrl : 'views/home.html',
                    controller : HomeController,
                    resolve : {
                        posts : [
                            "PostService", function(PostService) {
                                return PostService.postResolver();
                            }
                        ],
                        user : [
                            "UserService", function(UserService) {
                                return UserService.getUser();
                            }
                        ]
                    }
                },
                'mainView2' : {
                    template : '<div class="col-lg-12"><h1>Test SUBVIEW 2</h1></div>',
                    controller : BaseController
                }
            },
            data :{
                access  : [USER_ROLES.ADMIN, USER_ROLES.USER],
                page    : 'Profile'
            }
        };
        return ProfileState;
    });
})();