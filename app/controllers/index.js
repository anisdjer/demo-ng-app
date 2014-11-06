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
        
        var _moduleName = appSettings.getAppName() + '.controllers';
        var controllers = angular.module(_moduleName, []);
        
        
        /* Import Controllers */
        var MainCtrl = require('./main');
        
        
  
        controllers.controller("MainCtrl", MainCtrl);
        
        return _moduleName;
    });
})(angular);