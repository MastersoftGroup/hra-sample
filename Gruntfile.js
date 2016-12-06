module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);

    var extend = require('util')._extend;
    var pkg = grunt.file.readJSON('package.json');

    grunt.initConfig({
        appCfg: extend({
            //The credentials using in the examples
            // Please contact our support at 'support@mastersoftgroup.com@mastersoftgroup.com' if you do not know yours.
            api_username: "pson",
            credential: "W51V0lvL0VmgH1LtNxgArurJEH72DDZ0",
            token: "cHNvbjpXNTFWMGx2TDBWbWdIMUx0TnhnQXJ1ckpFSDcyRERaMA==",
            host: "http://dev.hosted.mastersoftgroup.com",
            sot: "AUPAF"
        }, pkg),

        clean: {
            dist: {
                files: [{
                    src: ['build/', 'dist/']
                }]
            },
            deploy: {
                files: [{
                    src: ['/var/www/html/<%= appCfg.name %>']
                }],
                options: {
                    force: true
                }
            }
        },

        copy: {
            build: {
                files: [{
                    expand: true,
                    cwd: 'scripts/',
                    src: ['*'],
                    dest: 'build/static'
                }]
            },
            deploy: {
                files: [{
                    expand: true,
                    cwd: 'build/',
                    src: ['*', '*/**'],
                    dest: '/var/www/html/<%= appCfg.name %>'
                }]
            }

        },

        bower: {
            dist: {
                dest: 'build/static',
                options: {
                    keepExpandedHierarchy: false,
                    packageSpecific: {
                        'harmony-js': {
                            files: ["*.js"]
                        },
                        'jquery-ui': {
                            stripGlobBase: true,
                            files: [
                                'jquery-ui.js',
                                'themes/smoothness/jquery-ui.css'
                            ]
                        }
                    }
                }
            }
        },

        'string-replace': {
            build: {
                files: [{
                    expand: true,
                    cwd: 'src/',
                    src: '**/*.html',
                    dest: 'build/'
                }],
                options: {
                    replacements: [{
                        pattern: '${api-username}',
                        replacement: '<%= appCfg.api_username %>'
                    }, {
                        pattern: '${credential}',
                        replacement: '<%= appCfg.credential %>'
                    }, {
                        pattern: '${host}',
                        replacement: '<%= appCfg.host %>'
                    }, {
                        pattern: '${token}',
                        replacement: '<%= appCfg.token %>'
                    }, {
                        pattern: '${sot}',
                        replacement: '<%= appCfg.sot %>'
                    }]
                }
            }
        },

        uglify: {
            libs: {
                files: [{
                    expand: true,
                    cwd: 'build/static',
                    src: '**/*.js',
                    dest: 'build/static'
                }]
            }
        },

        compress: {
            dist: {
                options: {
                    archive: 'dist/<%= appCfg.name %>-<%= appCfg.version %>.zip'
                },
                files: [{
                    expand: true,
                    cwd: 'build/',
                    src: ['**/*']
                }]
            }
        },
    });

    grunt.registerTask('build', [
        'clean:dist',
        'copy:build',
        'string-replace:build',
        'bower'
    ]);

    grunt.registerTask('dist', [
        'build',
        'uglify:libs',
        'compress:dist'
    ]);

    grunt.registerTask('default', [
        'build'
    ]);

    grunt.registerTask('deploy', 'deploy the build to apache folder [/var/www/html/]', [
        'build',
        'clean:deploy',
        'copy:deploy'
    ]);
}
