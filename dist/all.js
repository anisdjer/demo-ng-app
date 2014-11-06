(function () {/**
 * General Settings of the App
 */

(function(define) {
    
    define('app-settings',[],function() {
        
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
/** 
 * userRoles.js
 * 
 * 
 * 
 * @author Anis Bouhachem <anis.bouhachem@tritux.com>
 * @since 19 sept. 2014
 */
(function () {
    
    define('constants/userRoles',[], function() {
        var roles = {
            "ADMIN" : "admin", 
            "USER" : "user", 
            "ANONYMOUS": "anonymous"
        };
        return roles;
    });
})();
/** 
 * index.js
 * 
 * 
 * 
 * @author Anis Bouhachem <anis.bouhachem@tritux.com>
 * @since 19 sept. 2014
 */
(function () {
    
     define('constants/index',['require','app-settings','./userRoles'],function(require) { 
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
/** 
 * userService.js
 * 
 * 
 * 
 * @author Anis Bouhachem <anis.bouhachem@tritux.com>
 * @since 17 sept. 2014
 */
(function () {
    
    define('services/user',[], function() { 
        
            var _id,
                _username,
                _password,
                _email,
                _roles = []
            ;
        var User =  { 
            setUser     : function(user) {
                this.setId(user.id || 0);
                this.setEmail(user.email || "");
                this.setUsername(user.username || "");
                this.setPassword(user.password || ""); 
                this.setRoles(user.roles || []); 
                return this;
            },
            getUser     : function( ) { 
                return {
                    id          :   _id,
                    username    :   _username,
                    email       :   _email,
                    roles       :   _roles
                };
            },
            getId : function() {
                return _id;
            },
            setId : function(id) {
                _id = id;
                return this;
            },
            getUsername : function() {
                return _username;
            },
            setUsername : function(username) {
                _username = username;
                return this;
            },
            
            getPassword : function () {
                return _password;
            },
            setPassword : function(password) {
                _password = password;
                return this;
            },
            getEmail : function () {
                return _email;
            },
            setEmail : function(email) {
                _email = email;
                return this;
            },
            getRoles : function () {
                return _roles ;
            },
            setRoles    : function (roles) {
                _roles = roles;
                return this;
            }
        };
        return function() {
            return User;
        };
    });
})();
/** 
 * post.js
 * 
 * 
 * 
 * @author Anis Bouhachem <anis.bouhachem@tritux.com>
 * @since 18 sept. 2014
 */
(function () {
    
    define('services/post',['app-settings'], function(appSettings) { 
        
        var POST_RESOURCE_URL = appSettings.getPostRestApi().BASE_URL; 
   
        var defer = null;
        
        var Post = function($q, $resource){
            var postResource = $resource(POST_RESOURCE_URL );
            
            return { 
                addPost : function(post) {
                    console.log("PostService: add post : " + JSON.stringify(post));
                    postResource.save(post);
                },
                getPosts : function () {
                    return  this.postResolver();
                },
                postResolver : function() {
                    
                    defer = $q.defer();
                    return postResource.query(function(posts) {
                        if(defer !== null)
                            defer.resolve(posts);
                        defer = null;
                    });
                     
//                    return defer.promise;
                }
            };
        };
        
        
        return ["$q", "$resource", Post];
    });
})();
/** 
 * session.js
 * 
 * 
 * 
 * @author Anis Bouhachem <anis.bouhachem@tritux.com>
 * @since 17 sept. 2014
 */
(function () {
    
    define('services/session',['app-settings'], function(appSettings) { 
        
        
        var _session = {
            name : appSettings.getAppName(),
            data : {
                user : {
                    
                },
                locale : 'fr'
            }
        };
        
        
            
        var Session =  function($cookieStore, UserService){ 
            
            if($cookieStore.get(_session.name)) {
                _session.data = $cookieStore.get(_session.name);
                UserService.setUser(_session.data.user);    
            }
            
            
            return {
                set : function(key, value) {
                    _session.data[key] = value;
                    if(key) $cookieStore.put(_session.name, _session.data); 
                    return this;
                },
                get : function(key) {
                    var $$session = angular.extend($cookieStore.get(_session.name) || {}, _session.data);
                    return $$session[key];
                },
                destroy : function() {
                    $cookieStore.remove(_session.name);
                }
            };
        };
        return ["$cookieStore", "UserService", Session];
    });
})();
/** 
 * auth.js
 * 
 * 
 * 
 * @author Anis Bouhachem <anis.bouhachem@tritux.com>
 * @since 17 sept. 2014
 */
(function () {
    
    
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
    define('services/auth',['app-settings'], function(appSettings) { 
        
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
/** 
 * index.js
 * 
 * 
 * 
 * @author Anis Bouhachem <anis.bouhachem@tritux.com>
 * @since 17 sept. 2014
 */
(function(angular) {
    
    
    define('services/index',['require','app-settings','./user','./post','./session','./auth'],function(require) {
                
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
/** 
 * base.js
 * 
 * 
 * 
 * @author Anis Bouhachem <anis.bouhachem@tritux.com>
 * @since 17 sept. 2014
 */ 

(function() {
    
    
    define('controllers/base',[], function() {
       
       var BaseCtrl = function($scope) {
           console.log("Base Controller Definition");
       };
       
       return ["$scope", BaseCtrl];
    
    });
})();
/** 
 * login.js
 * 
 * 
 * 
 * @author Anis Bouhachem <anis.bouhachem@tritux.com>
 * @since 17 sept. 2014
 */

(function(angular) {
    
    
    define('controllers/login',['app-settings'], function(appSettings) { 
       
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
/** 
 * login.js
 * 
 * 
 * 
 * @author Anis Bouhachem <anis.bouhachem@tritux.com>
 * @since 17 sept. 2014
 */
(function () {
    
    define('routes/login',['require','controllers/base','controllers/login','constants/userRoles'],function(require) {
        var BaseController = require('controllers/base'),
            LoginController = require('controllers/login'), 
            USER_ROLES     = require('constants/userRoles')
        ;
        var LoginState = {
            url : '/login',
            'views' :   {
                'mainView' : {
                    templateUrl : 'views/login.html',
                    controller : LoginController 
                },
                'mainView2' : {
                    template : '<div class="col-lg-12"><h1>Test SUBVIEW 2</h1></div>',
                    controller : BaseController
                }
            },
            data :{
                access  : [USER_ROLES.ADMIN] 
            }
        };
        return LoginState;
    });
})();
/** 
 * dashboard.js
 * 
 * 
 * 
 * @author Anis Bouhachem <anis.bouhachem@tritux.com>
 * @since 18 sept. 2014
 */
(function () {
    
    
    define('controllers/dashboard',[], function() {
       
       var DashboardCtrl = function($scope, UserService) {
           
           $scope.user = UserService.getUser();
           console.log($scope.user);
       };
       
       return ["$scope", "UserService", DashboardCtrl];
    
    });
})();
/** 
 * dashboard.js
 * 
 * 
 * 
 * @author Anis Bouhachem <anis.bouhachem@tritux.com>
 * @since 17 sept. 2014
 */
(function () {
    
    define('routes/dashboard',['require','controllers/base','controllers/dashboard','constants/userRoles'],function(require) {
        var BaseController = require('controllers/base'), 
            DashboardCtrl = require('controllers/dashboard'),
            USER_ROLES     = require('constants/userRoles')
        ;
        var DashboardState = {
            url : '/dashboard',
            'views' :   {
                'mainView' : {
                    templateUrl : 'views/dashboard.html',
                    controller : DashboardCtrl 
                },
                'mainView2' : {
                    template : '<div class="col-lg-12"><h1>Test SUBVIEW 2</h1></div>',
                    controller : BaseController
                }
            },
            data :{
                access  : [USER_ROLES.ADMIN],
                page    : 'Dashboard'
            }
        };
        return DashboardState;
    });
})();
/** 
 * profile.js
 * 
 * 
 * 
 * @author Anis Bouhachem <anis.bouhachem@tritux.com>
 * @since 18 sept. 2014
 */
(function () {
    
    define('controllers/home',['app-settings'], function(appSettings) { 
       
       
       
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
           
           $scope.posts = PostService.getPosts();
           
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
/** 
 * profile.js
 * 
 * 
 * 
 * @author Anis Bouhachem <anis.bouhachem@tritux.com>
 * @since 18 sept. 2014
 */
(function () {
    
    define('routes/home',['require','controllers/base','controllers/home','constants/userRoles'],function(require) {
        var BaseController = require('controllers/base'),
            HomeController = require('controllers/home'),
            USER_ROLES     = require('constants/userRoles')
        ;
        var ProfileState = {
            url : '/home',
            'views' :   {
                'mainView' : {
                    templateUrl : 'views/home.html',
                    controller : HomeController,
                    resolve : {
                        posts : [
                            "PostService", function(PostService) {
                                return PostService.postResolver();
                            }
                        ],
                        user : [
                            "UserService", function(UserService) {
                                return UserService.getUser();
                            }
                        ]
                    }
                },
                'mainView2' : {
                    template : '<div class="col-lg-12"><h1>Test SUBVIEW 2</h1></div>',
                    controller : BaseController
                }
            },
            data :{
                access  : [USER_ROLES.ADMIN, USER_ROLES.USER],
                page    : 'Profile'
            }
        };
        return ProfileState;
    });
})();
/**
 * index.js
 * 
 * 
 * 
 * @author Anis Bouhachem <anis.bouhachem@tritux.com>
 * @since 17 sept. 2014
 */

(function(angular) {
    
    define('routes/index',['require','app-settings','./login','./dashboard','./home'],function(require) {
        var appSettings =  require( 'app-settings'); 
        
        var _moduleName = appSettings.getAppName() + '.routes';
        
        var routes = angular.module(_moduleName, ['ui.router']);
        
   
        routes.config([
            '$stateProvider', '$urlRouterProvider',
            function($stateProvider, $urlRouterProvider ) {
                $urlRouterProvider.otherwise('/home');

                /* Import States */
                var LoginState = require('./login'),
                    DashboardState  = require('./dashboard'),
                    HomeState  = require('./home');

                $stateProvider
                        .state('login', LoginState)
                        .state('dashboard', DashboardState)
                        .state('home', HomeState)
                        ;
            }]);
        
        
    return _moduleName;
    });
})(angular); 
/** 
 * main.js
 * 
 * 
 * 
 * @author Anis Bouhachem <anis.bouhachem@tritux.com>
 * @since 17 sept. 2014
 */

(function() {
    
    
    define('controllers/main',['app-settings'], function(appSettings) { 
       
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
/**
 * index.js
 * 
 * 
 * 
 * @author Anis Bouhachem <anis.bouhachem@tritux.com>
 * @since 17 sept. 2014
 */ 
(function(angular) {
    
    
    define('controllers/index',['require','app-settings','./main'],function(require) {
                
        var appSettings =  require( 'app-settings'); 
        
        var _moduleName = appSettings.getAppName() + '.controllers';
        var controllers = angular.module(_moduleName, []);
        
        
        /* Import Controllers */
        var MainCtrl = require('./main');
        
        
  
        controllers.controller("MainCtrl", MainCtrl);
        
        return _moduleName;
    });
})(angular);
/** 
 * nav.js
 * 
 * 
 * 
 * @author Anis Bouhachem <anis.bouhachem@tritux.com>
 * @since 24 sept. 2014
 */
(function() {
    
    
    define('directives/nav',[], function() {
       
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
/**
 * index.js
 * 
 * 
 * 
 * @author Anis Bouhachem <anis.bouhachem@tritux.com>
 * @since 24 sept. 2014
 */ 
(function(angular) {
    
    
    define('directives/index',['require','app-settings','./nav'],function(require) {
                
        var appSettings =  require( 'app-settings'); 
        
        var _moduleName = appSettings.getAppName() + '.directives';
        var directives = angular.module(_moduleName, []);
        
        
        /* Import Controllers */
        var Nav = require('./nav');
        
        
        console.log(Nav);
        directives.directive("nav", Nav);
        
        return _moduleName;
    });
})(angular);


 /**
 * @ngdoc module
 * @name App.js
 * @module ng-demo
 * @description
 * Creates a deep copy of `source`, which should be an object or an array.
 *
 * * If no destination is supplied, a copy of the object or array is created.
 * * If a destination is provided, all of its elements (for array) or properties (for objects)
 *   are deleted and then all elements/properties from the source are copied to it.
 * * If `source` is not an object or array (inc. `null` and `undefined`), `source` is returned.
 * * If `source` is identical to 'destination' an exception will be thrown.
 *
 * @param {*} source The source that will be used to make a copy.
 *                   Can be any type, including primitives, `null`, and `undefined`.
 * @param {(Object|Array)=} destination Destination into which the source is copied. If
 *     provided, must be of the same type as `source`.
 * @returns {*} The copy or updated `destination`, if `destination` was specified.
 *
 */

/**
 * app.js
 * 
 * 
 * 
 * @author Anis Bouhachem <anis.bouhachem@tritux.com>
 * @since 17 sept. 2014
 */

(function(angular) { 
    
    
    require.config({  
        baseUrl: "./",
        paths: {
            "app-settings": "./app-settings",
            "classes"    :   "./common/classes/index"
        }
    });  
        
    define(
            'app',[   'app-settings' ,
                "constants/index",
                "services/index",
                "routes/index",
                "controllers/index",
                "directives/index"
            ], 
            function(appSettings, constants, services, routes, controllers, directive) { 
               
                /**
                 * Define our App
                 */ 
                angular.module( 
                        appSettings.getAppName(), 
                        
                        /* Dependencies */
                        [   "ui.bootstrap" ,
                            'pascalprecht.translate',
                            "ui.router",
                            "ngResource" , 
                            "angular-websocket" ,
                            "ngCookies",
                            constants,
                            services,
                            routes,
                            controllers,
                            directive
                        ]
                )
                .config(["WebSocketProvider", function(WebSocketProvider){
                     
                    WebSocketProvider
                        .prefix('')
                        .uri(appSettings.getWebsocketURL());
                }])
                .filter('reverse', function() {
                    return function(items) {
                        console.log(items);
                      return items.slice().reverse();
                    };
                  })
                .run([ '$rootScope', '$location', 'AuthService',
                        function ( $rootScope, $location, AuthService ) {
 
                    $rootScope.$on('$stateChangeStart',
                                function(event, toState, toParams, fromState, fromParams){

                                    if(!AuthService.canAccess(toState.data.access)) { 
                                        $location.path(appSettings.authentication.LOGIN_URL);
                                        console.log("Failed : redirect to login");
                                    }
                    });  
                }])
                .config(['$translateProvider',
                    function( $translateProvider ) { 
                    $translateProvider.useStaticFilesLoader({
                        prefix: 'language/locate-',
                        suffix: '.json'
                    }).preferredLanguage('fr'); 
                }])
                ;
                
                
                /**
                * Bind Our App to the DOM
                */
                angular.bootstrap(document.getElementsByTagName('html')[0], [appSettings.getAppName()]);
                
                return angular.module(appSettings.getAppName());
            }); 
})(angular);

require(["app"]);
}());