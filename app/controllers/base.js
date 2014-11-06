/** 
 * base.js
 * 
 * 
 * 
 * @author Anis Bouhachem <anis.bouhachem@tritux.com>
 * @since 17 sept. 2014
 */ 

(function() {
    'use strict';
    
    define([], function() {
       
       var BaseCtrl = function($scope) {
           console.log("Base Controller Definition");
       };
       
       return ["$scope", BaseCtrl];
    
    });
})();