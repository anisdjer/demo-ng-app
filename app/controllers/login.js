/** 
 * login.js
 * 
 * 
 * 
 * @author Anis Bouhachem <anis.bouhachem@tritux.com>
 * @since 17 sept. 2014
 */

(function(angular) {
    'use strict';
    
    define(['app-settings'], function(appSettings) { 
       
       var LoginCtrl = function($scope, $location, AuthService, UserService) { 
           
           var credentials = {
               email : "",
               password : ""
           };
           
           $scope.loginError = false;
           $scope.form = angular.copy(credentials);
           
           
           $scope.loginProcess = function() {
                console.log("Login Form Submitted");
             
                $scope.loginError = false;
             
                AuthService.authenticateUser(angular.extend(credentials, $scope.form), function() {
                    $location.path(appSettings.authentication.SUCCESS_URL);
                },   function() {
                    console.log("Error alert");
                    $scope.loginError = true;
                });
           };
       };
       
       return ["$scope", "$location", "AuthService", "UserService", LoginCtrl];
    
    });
})(angular);