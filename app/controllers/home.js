/** 
 * profile.js
 * 
 * 
 * 
 * @author Anis Bouhachem <anis.bouhachem@tritux.com>
 * @since 18 sept. 2014
 */
(function () {
    'use strict';
    define(['app-settings'], function(appSettings) { 
       
       
       
       var HomeCtrl = function($rootScope, $scope, AuthService, UserService, PostService, SessionService, WebSocket) {
           
            function changeDateFormat (lng) {
                 if(lng==='fr') {
                     $scope.dateFormat =  "dd/MM/yyyy @ hh:mm:ss a";
                 }
                 if(lng==='en') {
                     $scope.dateFormat =  "yyyy-MM-dd @ hh:mm:ss a";
                 }
            }
            
           var USER_ROLES     = require('constants/userRoles');
           
           var current_locale = SessionService.get('locale' ); 
           
           $scope.dateFormat =  "dd/MM/yyyy @ hh:mm:ss a";
           $rootScope.$on('translate:change', function(e, data) {
              changeDateFormat (data.locale); 
           });
           
           
           $scope.newPost = {
               body : ''
           };
           
           PostService.getPosts().then(function(posts) {
			   $timeout(function() {
			   		$scope.posts = posts;
			   });
		   })
           
           $rootScope.user = UserService.getUser();
           $rootScope.user.isAdmin = AuthService.canAccess([USER_ROLES.ADMIN]);
           console.log("User is Admin ?");
           console.log(AuthService.canAccess([USER_ROLES.ADMIN]));
           $scope.addPost = function() {
               if(!$scope.newPost.body) {
                    $scope.postForm.$setDirty();
                   return;
               }
               var post = {
                    user : {
                       id       : UserService.getId(),
                       username : UserService.getUsername()                      
                   },
                   body : $scope.newPost.body,
                   timestamp : (new Date()).getTime()
                };
                
                PostService.addPost(post);
                
                $scope.newPost.body = "";
                
                $scope.postForm.$setPristine();
                
                WebSocket.send(JSON.stringify({ type : 2, post : post}));
           };
           
           
            WebSocket.new(appSettings.getWebsocketURL());
            WebSocket.onopen(function() {
                console.log('WebSocket connection'); 
                WebSocket.send( JSON.stringify({ type : 1, user : UserService.getUser()}) );
            });

            WebSocket.onmessage(function(event) {
                console.log(event.data);
                var data = {
                    type : 0
                };
                try {
                    data = JSON.parse(event.data);
                } catch (e) {
                }
                
                if(data.type === 2){
                  
                    $scope.$apply(function () {
                            $scope.posts = PostService.getPosts();
                    });
                }
            });

           
           console.log(UserService.getUser());
       };
       
       return ["$rootScope", "$scope", "AuthService", "UserService", "PostService", "SessionService","WebSocket", HomeCtrl];
    
    });
})();