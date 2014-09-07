module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: {
            options: {
                force: true
            },
            minifieds: [
                "css/*.min.css", "css-dev/*.min.css",
                "js-dev/*.min.js", "js-dev/flowchart/flow.js",
                "js-dev/flowchart/*.min.js", "../src/template/*.min"
            ]
        },
        concat: {
            flowchart: {
                src: [
                    'js-dev/flowchart/defaults.js', 'js-dev/flowchart/cache.js',
                    'js-dev/flowchart/templates.js', 'js-dev/flowchart/state.js',
                    'js-dev/flowchart/ui-elements.js', 'js-dev/flowchart/execution-handler.js',
                    'js-dev/flowchart/flowchart-handler.js',
                    'js-dev/flowchart/shape.js', 'js-dev/flowchart/shape-handler.js',
                    'js-dev/flowchart/util.js', 'js-dev/flowchart/flowchart-listeners.js',
                    'js-dev/flowchart/shape-listeners.js', 'js-dev/flowchart/nodes.js',
                    'js-dev/flowchart/element-selection.js'
                ],
                dest: 'js-dev/flowchart/flow.js'
            },
            footerVendorJS: {
                options: {
                    separator: '\n\n\n'
                },
                src: [
                    'js/alertify.min.js', 'js/jquery-2.1.0.min.js',
                    'js/jquery-ui-1.9-2.min.js', 'js/jquery.jsPlumb-1.5.5.min.js',
                    'js/semantic.min.js'
                ],
                dest: 'js/libraries.min.js'
            },
            headerVendorCSS: { // register after uglify
                options: {
                    separator: '\n\n\n'
                },
                src: [
                    'css/alertify.core.min.css', 'css/alertify.default.min.css',
                    'css/default.min.css', 'css/semantic.min.css'
                ],
                dest: 'css/libraries.min.css'
            },
            flowchartPageJS: {
                options: {
                    separator: '\n\n'
                },
                src: [
                    'js/pace.min.js', 'js/jquery.jsPlumb-1.5.5.min.js',
                    'js-dev/flowchart/flow.min.js'
                ],
                dest: 'js-dev/flowchart-concatenated.min.js'
            },
            flowchartPageCSS: {
                options: {
                    separator: '\n\n'
                },
                src: [
                    'css/pace.min.css', 'css-dev/shapes.min.css',
                    'css-dev/flowchart.min.css', 'css-dev/flowchart-help.min.css'
                ],
                dest: 'css-dev/flowchart-concatenated.min.css'
            }
        },
        uglify: {
            options: {
                mangle: true,
                squeeze: true,
                codegen: true,
                banner: '/*! Flow 0.1.0 - ' +
                    '<%= grunt.template.today("yyyy-mm-dd") %> */'
            },
            targetOne: {
                src: 'js-dev/flowchart/flow.js',
                dest: 'js-dev/flowchart/flow.min.js'
            },
            targetTwo: {
                expand: true,
                cwd: 'js-dev/',
                src: ['**/*.js', '!flowchart/flow.js', '!flowchart/flow.min.js'],
                dest: 'js-dev/',
                ext: '.min.js'
            }
        },
        htmlmin: {// Task
            dist: {// Target
                options: {// Target options
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: {// Dictionary of files
                    '../src/template/flowchart.mustache.min': '../src/template/flowchart.mustache',
                    '../src/template/flowchart_config_menu.mustache.min': '../src/template/flowchart_config_menu.mustache',
                    '../src/template/flowchart_pagination.mustache.min': '../src/template/flowchart_pagination.mustache',
                    '../src/template/header.mustache.min': '../src/template/header.mustache',
                    '../src/template/home.mustache.min': '../src/template/home.mustache',
                    '../src/template/register.mustache.min': '../src/template/register.mustache',
                    '../src/template/flowchart-help.mustache.min': '../src/template/flowchart-help.mustache'
                }
            }
        },
        cssmin: {
            minifyDev: {
                expand: true,
                cwd: 'css-dev/',
                src: ['*.css', '!*.min.css'],
                dest: 'css-dev/',
                ext: '.min.css'
            },
            minifyVendor: {
                expand: true,
                cwd: 'css/',
                src: ['*.css', '!*.min.css'],
                dest: 'css/',
                ext: '.min.css'
            },
            minifyVendorAlertifyFix1: {
                src: 'css/alertify.default.css',
                dest: 'css/alertify.default.min.css'
            },
            minifyVendorAlertifyFix2: {
                src: 'css/alertify.core.css',
                dest: 'css/alertify.core.min.css'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-clean');

    // Default task(s).
    grunt.registerTask(
        'default',
        [
            'clean', 'concat:flowchart:footerVendorJS', 'uglify', 'htmlmin', 'cssmin',
            'concat:headerVendorCSS', 'concat:flowchartPageJS', 'concat:flowchartPageCSS'
        ]
    );

};
