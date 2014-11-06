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
                "controllers/index"
            ], 
            function(appSettings, constants, services, routes, controllers) { 
            
                /**
                 * Define our App
                 */
                angular.module(
                        appSettings.getAppName(), 
                        
                        /* Dependencies */
                        [   "ui.bootstrap" ,
                            "ngResource" ,
                            "angular-websocket" ,
                            "ngCookies",
                            constants,
                            services,
                            routes,
                            controllers,
                            'angular-loading-bar', 'ngAnimate'
                        ]
                )
                .config(function(WebSocketProvider){
                    WebSocketProvider
                        .prefix('')
                        .uri(appSettings.getWebsocketURL());
                })
                .filter('reverse', function() {
                    return function(items) {
                      return items.slice().reverse();
                    };
                  })
                .run([ '$rootScope', '$location', 'AuthService',
                        function ( $rootScope, $location, AuthService ) {
 
                    $rootScope.$on('$stateChangeStart',
                    [   "event", "toState", "toParams", "fromState", "fromParams",
                                function(event, toState, toParams, fromState, fromParams){

                                    if(!AuthService.canAccess(toState.data.access)) { 
                                        $location.path(appSettings.authentication.LOGIN_URL);
                                        console.log("Failed : redirect to login");
                                    }
                    }]);
                }])
//                .config('$translateProvider',
//                    function( $translateProvider , locale) {
//                    $translateProvider.useStaticFilesLoader({
//                        prefix: 'language/locate-',
//                        suffix: '.json'
//                    }).preferredLanguage(locale); 
//                })
                ;
                
                
                /**
                * Bind Our App to the DOM
                */
                angular.bootstrap(document.getElementsByTagName('html')[0], [appSettings.getAppName()]);
                
                return angular.module(appSettings.getAppName());
            }); 
})(angular);