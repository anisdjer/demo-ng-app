module.exports = function(grunt) {
    require('time-grunt')(grunt);
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    bower: {
        install: {
            options: {
                cleanTargetDir : false,
                cleanBowerDir : false,
                copy : false
            }
        }
      },
    bowerInstall: {

        target: {
            src: './dist/index.html' // point to your HTML file.
            ,options: {
                cwd: './',
                dependencies: true,
                devDependencies: true,
                exclude: [],
                fileTypes: {},
                ignorePath: '',
                overrides: {
                    
                }
              }
        }
    },
    
    requirejs: {
        compile: {
            options: { 
                baseUrl: "./dist/js/",
                include: ['app'],
                insertRequire: ['app'],
                mainConfigFile: "./dist/js/app.js",
                out: "dist/all.js",
                wrap: true
    ,    optimize : "none"
            } 
        }
    },
    cssmin: {
        combine: {
          files: {
            './dist/all.css': ['./app/public/css/*']
          }
        }
    },

    copy: {
        main: {
         files: [
           // includes files within path and its sub-directories
           {
               expand: true, cwd: 'app/', src: ['./**/*.html'], dest: 'dist/'
           },
           {
               expand: true, cwd: 'app/', src: ['./**/*.js'], dest: 'dist/js/'
           },
           {
               expand: true, cwd: 'app/public', src: ['./img/**'], dest: 'dist/'
           },
           {
               expand: true, cwd: 'app/', src: ['./**/*.json'], dest: 'dist/'
           }
//           {
//               expand: true, cwd: 'app/public/', src: ['./**/*.css'], dest: 'dist/'
//           }
           
         ]
        }
    },
    clean: {
        js : ["./dist/js"]
    },
    execute: {
        target: {
            src: ['server.js']
        }
    },
    watch: {
        scripts: {
          files: ['./app/**/*', './bower.json'],
          tasks: ['default'],
          options: {
            spawn: false,
            livereload: true
          }
        }
    },
    connect: {
      all: {
        options:{
          port: 9900,
          hostname: "0.0.0.0",
          // Prevents Grunt to close just after the task (starting the server) completes
          // This will be removed later as `watch` will take care of that
          keepalive: true,
 
          // Livereload needs connect to insert a cJavascript snippet
          // in the pages it serves. This requires using a custom connect middleware
          middleware: function(connect, options) {
 
            return [
 
              // Load the middleware provided by the livereload plugin
              // that will take care of inserting the snippet
              require('grunt-contrib-livereload/lib/utils').livereloadSnippet,
 
              // Serve the project folder
//              connect.static(options.base)
              connect.static("./dist/")
            ];
          }
        }
      }
    },
    // grunt-open will open your browser at the project's URL
    open: {
      all: {
        // Gets the port from the connect configuration
        path: 'http://localhost:<%= connect.all.options.port%>'
      }
    },
    
    
    docular: {
        docular_webapp_target : './dist/docs/',
        baseUrl: '/docs/', //base tag used by Angular
        showAngularDocs: false, //parse and render Angular documentation
        showDocularDocs: false, //parse and render Docular documentation
        docAPIOrder : ['anis'], //order to load ui resources
        groups: [{
              
            groupTitle: 'Anis Docs', //Title used in the UI
            groupId: 'anis', //identifier and determines directory
            groupIcon: 'icon-bar', //Icon to use for this group
            sections: [
                {
                    id: "app",
                    title:"App",
                    scripts: [__dirname + "/app/doc.js"]
                }
            ]
        }] //groups of documentation to parse
    },
    
     removelogging: {
        dist: {
          src: "dist/all.js",
          dest: "dist/all.js",

          options: {
            // see below for options. this is optional.
          }
        }
    },
    
    jshint: {
        dev: {        
            src: ['./app/**/*.js']
        }
    }


  });
 
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-wiredep');
    grunt.loadNpmTasks('grunt-bower-install');
    grunt.loadNpmTasks('grunt-bower-task');
    grunt.loadNpmTasks('grunt-execute');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-regarde');
    grunt.loadNpmTasks('grunt-contrib-livereload');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks("grunt-remove-logging");
    grunt.loadNpmTasks("grunt-notify");
    
    grunt.loadNpmTasks('grunt-contrib-jshint');
    
    grunt.loadNpmTasks('grunt-docular');
    
    
    grunt.registerTask('docs', ['docular']);
    
    
    // Default task(s).
    grunt.registerTask('default', ['copy', 'requirejs', 'cssmin', 'clean:js', 'bower', 'bowerInstall']);
    grunt.registerTask('serve' , ['execute']);
    
    // Creates the `server` task
    grunt.registerTask('server',[
      // Open before connect because connect uses keepalive at the moment
      // so anything after connect wouldn't run
      'open',
      // Starts the livereload server to which the browser will connect to
      // get notified of when it needs to reload
      'livereload-start',
      'connect'
    ]);
    
    
    
    grunt.registerTask('test' , function(){
        console.log(__dirname);
    });
};