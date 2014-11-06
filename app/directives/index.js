/**
 * index.js
 * 
 * 
 * 
 * @author Anis Bouhachem <anis.bouhachem@tritux.com>
 * @since 24 sept. 2014
 */ 
(function(angular) {
    'use strict';
    
    define(function(require) {
                
        var appSettings =  require( 'app-settings'); 
        
        var _moduleName = appSettings.getAppName() + '.directives';
        var directives = angular.module(_moduleName, []);
        
        
        /* Import Controllers */
        var Nav = require('./nav');
        
        
        console.log(Nav);
        directives.directive("nav", Nav);
        
        return _moduleName;
    });
})(angular);