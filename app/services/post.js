/** 
 * post.js
 * 
 * 
 * 
 * @author Anis Bouhachem <anis.bouhachem@tritux.com>
 * @since 18 sept. 2014
 */
(function () {
    'use strict';
    define(['app-settings'], function(appSettings) { 
        
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