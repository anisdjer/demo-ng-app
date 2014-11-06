

 /**
 * @ngdoc module
 * @name App.js
 * @module ng-demo
 * @description
 * Creates a deep copy of `source`, which should be an object or an array.
 *
 * * If no destination is supplied, a copy of the object or array is created.
 * * If a destination is provided, all of its elements (for array) or properties (for objects)
 *   are deleted and then all elements/properties from the source are copied to it.
 * * If `source` is not an object or array (inc. `null` and `undefined`), `source` is returned.
 * * If `source` is identical to 'destination' an exception will be thrown.
 *
 * @param {*} source The source that will be used to make a copy.
 *                   Can be any type, including primitives, `null`, and `undefined`.
 * @param {(Object|Array)=} destination Destination into which the source is copied. If
 *     provided, must be of the same type as `source`.
 * @returns {*} The copy or updated `destination`, if `destination` was specified.
 *
 */

/**
 * app.js
 * 
 * 
 * 
 * @author Anis Bouhachem <anis.bouhachem@tritux.com>
 * @since 17 sept. 2014
 */

(function(angular) { 
    'use strict';
    
    require.config({  
        baseUrl: "./",
        paths: {
            "app-settings": "./app-settings",
            "classes"    :   "./common/classes/index"
        }
    });  
        
    define(
            [   'app-settings' ,
                "constants/index",
                "services/index",
                "routes/index",
                "controllers/index",
                "directives/index"
            ], 
            function(appSettings, constants, services, routes, controllers, directive) { 
               
                /**
                 * Define our App
                 */ 
                angular.module( 
                        appSettings.getAppName(), 
                        
                        /* Dependencies */
                        [   "ui.bootstrap" ,
                            'pascalprecht.translate',
                            "ui.router",
                            "ngResource" , 
                            "angular-websocket" ,
                            "ngCookies",
                            constants,
                            services,
                            routes,
                            controllers,
                            directive
                        ]
                )
                .config(["WebSocketProvider", function(WebSocketProvider){
                     
                    WebSocketProvider
                        .prefix('')
                        .uri(appSettings.getWebsocketURL());
                }])
                .filter('reverse', function() {
                    return function(items) {
                        console.log(items);
                      return items.slice().reverse();
                    };
                  })
                .run([ '$rootScope', '$location', 'AuthService',
                        function ( $rootScope, $location, AuthService ) {
 
                    $rootScope.$on('$stateChangeStart',
                                function(event, toState, toParams, fromState, fromParams){

                                    if(!AuthService.canAccess(toState.data.access)) { 
                                        $location.path(appSettings.authentication.LOGIN_URL);
                                        console.log("Failed : redirect to login");
                                    }
                    });  
                }])
                .config(['$translateProvider',
                    function( $translateProvider ) { 
                    $translateProvider.useStaticFilesLoader({
                        prefix: 'language/locate-',
                        suffix: '.json'
                    }).preferredLanguage('fr'); 
                }])
                ;
                
                
                /**
                * Bind Our App to the DOM
                */
                angular.bootstrap(document.getElementsByTagName('html')[0], [appSettings.getAppName()]);
                
                return angular.module(appSettings.getAppName());
            }); 
})(angular);