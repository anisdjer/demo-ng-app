/** 
 * userService.js
 * 
 * 
 * 
 * @author Anis Bouhachem <anis.bouhachem@tritux.com>
 * @since 17 sept. 2014
 */
(function () {
    'use strict';
    define([], function() { 
        
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