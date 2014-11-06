/**
 * General Settings of the App
 */

(function(define) {
    'use strict';
    define(function() {
        
        var _appName = "ng-demo",
            _wsUrl  =   "ws://" + window.location.host,
            _postRestApi = {
                BASE_URL : '/api/posts'
            };
        
        
        return {
            authentication : {
                LOGIN_URL   : '/login',
                AUTH_URL    : 'http://' + window.location.host + '/api/auth',
                SUCCESS_URL : '/home',
                
                
                AUTH_SUCCESS_EVENT_NAME : "auth:success"
            },
            getAppName : function() {
                return _appName;
            },
            getWebsocketURL : function() {
                return _wsUrl;
            },
            getPostRestApi : function() {
                return _postRestApi;
            }
        };
    });
    
})(define);