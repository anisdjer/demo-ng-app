/** 
 * auth.js
 * 
 * 
 * 
 * @author Anis Bouhachem <anis.bouhachem@tritux.com>
 * @since 17 sept. 2014
 */
(function () {
    'use strict';
    
    /* A helper : should be in a different file or extend the Array object */
    function arrayDiff(arr1, arr2) {
        var diff = [];
        arr1 = arr1 || [];
        arr2 = arr2 || [];
        for(var i = 0, l = arr1.length; i<l; i+=1) {
            if(arr2.indexOf(arr1[i]) > -1) {
                diff.push(arr1[i]);
            }
        }
        return diff;
    }
    define(['app-settings'], function(appSettings) { 
        
        var Auth =  function($q, $http, $location, $rootScope, UserService, SessionService){ 
            
            var user = null;
            
            
            
            
            
            
            /**
             * Check User  Credentials 
             * 
             * @param {type} credentials
             * @returns {promise}
             */
            function checkCredentials(credentials) {
                console.log("Check Credentials");
                var defer = $q.defer();
                
                $http({ 
                    url: appSettings.authentication.AUTH_URL,
                    
                    method: 'POST',
                    data: {
                        username: credentials.email || "",
                        password: credentials.password || ""
                    }
                }).success(function (data) {
                        
                    if( data.result === 1 ) {
                        user = data.user;
                        defer.resolve(user);
                    } else {
                        defer.reject();
                    }
                  
                }).error(function () {
                    defer.reject();
                });

                return defer.promise;
 
            }
            
            
            return {
                isAuthenticated  : function() {
                    // TODO : user.isLoggedIn
                },
                authenticateUser : function(credentials, successCallback, failureCallback) {
                    
                    checkCredentials(credentials)
                        .then(function(user){
                                console.log("User Authenticated");
                                console.log(user);
                                user.isLoggedIn = true;
                                console.log(UserService.setUser( user ));
                                
                                SessionService.set("user", user);
                                $rootScope.$broadcast(appSettings.authentication.AUTH_SUCCESS_EVENT_NAME, user);
                                if( typeof successCallback === "function" ) 
                                    successCallback();
                                
                                
                            }, function() {
                                console.log("Auth Failed");
                                if( typeof failureCallback === "function" ) 
                                    failureCallback();
                         });
                    
                },
                canAccess : function(access) {
                    var user = SessionService.get("user");
                    if(! angular.isArray(access)) {
                        access = [access];
                    }
                    console.log(access);
                    console.log(user.roles);
                    console.log("Can access " + user.isLoggedIn && arrayDiff(user.roles, access).length > 0);
                    return user.isLoggedIn && arrayDiff(user.roles , access).length > 0 ;
                }
            };
        };
        return ["$q", "$http", "$location", "$rootScope", "UserService", "SessionService", Auth];
    });
})();