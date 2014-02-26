'use strict';

var fs = require( 'fs' );
var view = require( './server/config' ).data.production.view;

module.exports = function( grunt ) {

    var apps = fs.readdirSync( 'client/' + view ).filter( function( x ){
        return fs.statSync( 'client/' + view + '/' + x ).isDirectory( );
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
        lessTask = {
            options: {
                compress: true
            }
        };
    

    apps.forEach( function( x ){

        requirejsTask[ x ] = {
            options: {
                baseUrl: './',
                name: 'client/' + view + '/' + x + '/main',
                mainConfigFile: 'client/config.js',
                out: 'dist/' + x + '.js',
                optimize: 'none'
            }
        };


        uglifyTask[ x ] = {
            src: 'dist/' + x + '.js',
            dest: 'dist/' + x + '.js'
        };


        lessTask[ x ] = {
            src: 'client/' + view + '/' + x + '/main.less',
            dest: 'dist/' + x + '.css'
        };

    } );


    uglifyTask.requirejs = {
        src: 'bower_components/requirejs/require.js',
        dest: 'dist/require.js'
    };



    grunt.initConfig( {

        clean: {
            files: [
                'dist'
            ]
        },
        requirejs: requirejsTask,
        uglify: uglifyTask,
        less: lessTask

    } );


    grunt.loadNpmTasks( 'grunt-contrib-less' );
    grunt.loadNpmTasks( 'grunt-contrib-clean' );
    grunt.loadNpmTasks( 'grunt-contrib-uglify' );
    grunt.loadNpmTasks( 'grunt-contrib-requirejs' );

    grunt.registerTask( 'default', [ 'clean', 'requirejs', 'uglify', 'less' ] );

};