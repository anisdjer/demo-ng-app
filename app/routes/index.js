/**
 * index.js
 * 
 * 
 * 
 * @author Anis Bouhachem <anis.bouhachem@tritux.com>
 * @since 17 sept. 2014
 */

(function(angular) {
    'use strict';
    define(function(require) {
        var appSettings =  require( 'app-settings'); 
        
        var _moduleName = appSettings.getAppName() + '.routes';
        
        var routes = angular.module(_moduleName, ['ui.router']);
        
   
        routes.config([
            '$stateProvider', '$urlRouterProvider',
            function($stateProvider, $urlRouterProvider ) {
                $urlRouterProvider.otherwise('/home');

                /* Import States */
                var LoginState = require('./login'),
                    DashboardState  = require('./dashboard'),
                    HomeState  = require('./home');

                $stateProvider
                        .state('login', LoginState)
                        .state('dashboard', DashboardState)
                        .state('home', HomeState)
                        ;
            }]);
        
        
    return _moduleName;
    });
})(angular); 