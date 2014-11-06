/** 
 * session.js
 * 
 * 
 * 
 * @author Anis Bouhachem <anis.bouhachem@tritux.com>
 * @since 17 sept. 2014
 */
(function () {
    'use strict';
    define(['app-settings'], function(appSettings) { 
        
        
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