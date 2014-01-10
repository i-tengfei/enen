'use strict';

var fs = require( 'fs' );
var view = require( './app/server/config' ).data.production.view;

module.exports = function( grunt ) {

    var apps = fs.readdirSync( 'app/client/' + view ).filter( function( x ){
        return fs.statSync( 'app/client/' + view + '/' + x ).isDirectory( );
    } );

    var config = {

        pkg: grunt.file.readJSON( 'package.json' ),

        banner: [
            '// -------------------- //',
            '// <%= pkg.name %>',
            '// v<%= pkg.version %>',
            '// <%= grunt.template.today("yyyy-mm-dd") %>',
            '// -------------------- //\n'
        ].join( '\n' )

    };


    var requirejsTask = {},
        uglifyTask = {},
        lessTask = {},
        cssminTask = {};
    

    apps.forEach( function( x ){

        requirejsTask[ x ] = {
            options: {
                baseUrl: './',
                name: 'app/client/' + view + '/' + x + '/main',
                mainConfigFile: 'app/client/config.js',
                out: 'app/dist/' + x + '.js',
                optimize: 'none'
            }
        };


        uglifyTask[ x ] = {
            src: 'app/dist/' + x + '.js',
            dest: 'app/dist/' + x + '.js'
        };


        lessTask[ x ] = {
            src: 'app/client/' + view + '/' + x + '/main.less',
            dest: 'app/dist/' + x + '.css'
        };


        cssminTask[ x ] = {
            src: 'app/dist/' + x + '.css',
            dest: 'app/dist/' + x + '.css'
        };

    } );


    uglifyTask.requirejs = {
        src: 'bower_components/requirejs/require.js',
        dest: 'app/dist/require.js'
    };



    grunt.initConfig( {

        clean: {
            files: [
                'app/dist'
            ]
        },
        requirejs: requirejsTask,
        uglify: uglifyTask,
        less: lessTask,
        cssmin: cssminTask

    } );


    grunt.loadNpmTasks( 'grunt-contrib-less' );
    grunt.loadNpmTasks( 'grunt-contrib-clean' );
    grunt.loadNpmTasks( 'grunt-contrib-uglify' );
    grunt.loadNpmTasks( 'grunt-contrib-cssmin' );
    grunt.loadNpmTasks( 'grunt-contrib-requirejs' );

    grunt.registerTask( 'default', [ 'clean', 'requirejs', 'uglify', 'less', 'cssmin' ] );

};