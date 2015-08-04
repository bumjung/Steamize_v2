module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                banner: '/*\n <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> \n*/\n'
            },
            build: {
                files: {
                    'dist/js/main.min.js': 'static/js/main.js'
                }
            }
        },
        less: {
            build: {
                files: {
                    'static/css/main.css': 'static/less/main.less'
                }
            }
        },
        cssmin: {
            options: {
                banner: '/*\n <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> \n*/\n'
            },
            build: {
                files: {
                    'dist/css/style.min.css': 'static/css/main.css'
                }
            }
        },
        watch: {
            files: 'static/less/*.less',
            tasks: ['less','cssmin']
        },
        scripts: {
            files: 'static/js/*.js',
            tasks: 'uglify'
        },
        requirejs: {
            options: {
                paths: {
                    'appFiles': './src/core/mvc/'
                },
                removeCombined: true,
                out: './dist/js/angular/steamize.min.js',
                optimize: 'none',
                name: './src/core/mvc/main'
            },
            dev:{
                options:{
                    optimize:'none'
                }
            },
            release:{
                options:{
                    optimize:'uglify'
                }
              }
        }
    });


    grunt.registerTask('default', ['less', 'cssmin']);

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
};
