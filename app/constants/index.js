/** 
 * index.js
 * 
 * 
 * 
 * @author Anis Bouhachem <anis.bouhachem@tritux.com>
 * @since 19 sept. 2014
 */
(function () {
    'use strict';
     define(function(require) { 
        var appSettings =  require('app-settings'); 
        
        var _moduleName = appSettings.getAppName() + '.constants';
        
        /* Import constants */
        var 
            userRoles   =   require('./userRoles')
        ;
        
        var constants = angular.module(_moduleName, []);
        constants
                .constant("USER_ROLES", userRoles);
        
        
        return _moduleName;
     });
})();