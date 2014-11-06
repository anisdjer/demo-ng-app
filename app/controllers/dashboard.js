/** 
 * dashboard.js
 * 
 * 
 * 
 * @author Anis Bouhachem <anis.bouhachem@tritux.com>
 * @since 18 sept. 2014
 */
(function () {
    'use strict';
    
    define([], function() {
       
       var DashboardCtrl = function($scope, UserService) {
           
           $scope.user = UserService.getUser();
           console.log($scope.user);
       };
       
       return ["$scope", "UserService", DashboardCtrl];
    
    });
})();