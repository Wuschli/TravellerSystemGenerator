/*global module, require, console */
/*jslint nomen: true*/

module.exports = function (grunt) {
    'use strict';
    
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        
        jade: {
            build: {
                options: {
                    pretty: true,
                    data: {
                        debug: true,
                        version: '<%= pkg.version %>',
                        timestamp: '<%= grunt.template.today("yyyy-mm-dd hh:MM:ss") %>'
                    }
                },
                files: [
                    {'build/<%= pkg.version %>/index.html': 'src/jade/index.jade'},
                    {expand: true, cwd: 'src/jade/handlebars/', src: '**/*.jade', dest: 'temp/handlebars', ext: '.hbs'}
                ]
            },
            dist: {
                options: {
                    pretty: false,
                    data: {
                        debug: false,
                        version: '<%= pkg.version %>',
                        timestamp: '<%= grunt.template.today("yyyy-mm-dd hh:MM:ss") %>'
                    }
                },
                files: [
                    {'dist/index.html': 'src/jade/index.jade'},
                    {expand: true, src: 'src/jade/handlebars/*.jade', dest: 'temp/handlebars', ext: '.hbs'}
                ]
            }
        },
        
        less: {
            build: {
                options: {
                    paths: ['src/less', 'src/less/test', 'src/components'],
                    strictImports: true
                },
                files: {
                    'build/<%= pkg.version %>/styles/main.css': 'src/less/main.less'
                }
            },
            dist: {
                options: {
                    yuicompress: true,
                    paths: ['src/less', 'src/less/test', 'src/components'],
                    strictImports: true
                },
                files: {
                    'dist/styles/main.css': 'src/less/main.less'
                }
            }
        },
        
        handlebars: {
            build: {
                options: {
                    namespace: 'Handlebars.templates',
                    amd: true,
                    processName: function (filename) {
                        var pieces = filename.split('/'),
                            name = pieces[pieces.length - 1].split('.')[0];
                        return name;
                    }
                },
                files: {
                    'build/<%= pkg.version %>/scripts/templates.js': 'temp/handlebars/*.hbs'
                }
            },
            dist: {
                options: {
                    namespace: 'Handlebars.templates',
                    amd: true,
                    processName: function (filename) {
                        var pieces = filename.split('/'),
                            name = pieces[pieces.length - 1].split('.')[0];
                        return name;
                    }
                },
                files: {
                    'temp/scripts/templates.js': 'temp/handlebars/*.hbs'
                }
            }
        },
        
        copy: {
            build: {
                files: [
                    {expand: true, cwd: 'src/', src: ['scripts/*.js', 'components/**', 'img/**', 'fonts/**', 'data/**'], dest: 'build/<%= pkg.version %>/'}
                ]
            },
            dist: {
                files: [
                    {expand: true, cwd: 'src/', src: ['img/**', 'fonts/**', 'data/**'], dest: 'dist/'},
                    {expand: true, flatten: true, cwd: 'src/', src: ['components/requirejs/require.js'], dest: 'dist/scripts/'}
                ]
            }
        },
        
        requirejs: {
            dist: {
                options: {
                    mainConfigFile: './src/scripts/main.js',
                    baseUrl: './src',
                    // paths: {
                    //     'scripts/templates': '../temp/scripts/templates'
                    // },
                    name: 'scripts/main',
                    out: 'dist/scripts/main.js',
                    optimize: "uglify",
                }
            }
        },
        
        regarde: {
            source: {
                files: ['src/**'],
                tasks: ['build']
            }
        },
        
        connect: {
            server: {
                options: {
                    port: 8080,
                    hostname: "127.0.0.1",
                    base: "./build/<%= pkg.version %>"
                }
            }
        },
        
        
        clean: {
            build: ['build/<%= pkg.version %>/', 'temp'],
            dist: ['dist'],
            docs: ['docs']
        }
    });
    
    grunt.loadNpmTasks('grunt-contrib');
    grunt.loadNpmTasks('grunt-regarde');
    
    
    grunt.registerTask('build', ['jade:build', 'less:build', 'handlebars:build', 'copy:build']);
    grunt.registerTask('docs', ['clean:docs', 'yuidoc:compile']);
    grunt.registerTask('default', ['build']);
    grunt.registerTask('run', ['build', 'connect', 'regarde']);
    grunt.registerTask('dist', ['clean:dist', 'jade:dist', 'less:dist', 'handlebars:dist', 'requirejs:dist', 'copy:dist']);
    
};