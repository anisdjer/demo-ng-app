/** 
 * nav.js
 * 
 * 
 * 
 * @author Anis Bouhachem <anis.bouhachem@tritux.com>
 * @since 24 sept. 2014
 */
(function() {
    'use strict';
    
    define([], function() {
       
       var Nav = function() {
           return {
              restrict : 'A',
              templateUrl : 'views/nav.html',
              controller : function() {}
           };
       };
       
       return Nav;
    
    });
})();