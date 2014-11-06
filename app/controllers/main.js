/** 
 * main.js
 * 
 * 
 * 
 * @author Anis Bouhachem <anis.bouhachem@tritux.com>
 * @since 17 sept. 2014
 */

(function() {
    'use strict';
    
    define(['app-settings'], function(appSettings) { 
       
       var MainCtrl = function($rootScope, $scope, $translate, UserService, WebSocket, SessionService) {
            console.log("Main Controller Definition");
           var current_locale = SessionService.get('locale' ) || 'fr'; 
           
           $scope.user = UserService.getUser();
            
            $scope.languages = [
                'fr' , 'en'
            ];
            $scope.locale = current_locale;
            
            $translate.use(current_locale);  
            
            $scope.changeLng = function(lng){ 
                SessionService.set('locale', lng);
                $translate.use(lng);
                $rootScope.$broadcast('translate:change', {locale : lng});
                $scope.locale = lng;
            };
            
            $scope.logout = function() {
                SessionService.destroy();
            };
            
            $rootScope.$on(appSettings.authentication.AUTH_SUCCESS_EVENT_NAME, function(e, user) {
                console.log("Auth:Success received in MainCtrl");
                console.log(user);
                $scope.user = user || {};
            });
           
            $rootScope.$on('$stateChangeStart', 
                function(event, toState, toParams, fromState, fromParams){
                     $scope.page  = toState.data.page;
            });
            
            
            
       };
       
       return ["$rootScope", "$scope", "$translate", "UserService", "WebSocket", "SessionService", MainCtrl];
    
    });
})();