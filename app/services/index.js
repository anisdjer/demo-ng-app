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
                
        var appSettings =  require('app-settings'); 
        
        var _moduleName = appSettings.getAppName() + '.services';
        var services    = angular.module(_moduleName, []);
        
        
        /* Import Services */
        var User = require('./user'),
            Post = require('./post'),
            Session = require('./session'),
            Auth = require('./auth');
        
        
        services.factory("UserService", User)
                .factory("SessionService", Session)
                .factory("PostService", Post)
                .factory("AuthService", Auth);
        
        return _moduleName;
    });
})(angular);