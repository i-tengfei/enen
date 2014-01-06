'use strict';

var fs = require( 'fs' );

module.exports = function( grunt ) {

    grunt.registerMultiTask( 'config', 'requirejs config', function( ) {
        this.target;
        this.data;
        var name = this.data.options.name;
        this.files.forEach( function( x ){
            var data = grunt.file.read( x.src[ 0 ], { encoding: 'utf8' } );
            grunt.file.write( x.dest, data + ';require( [\'./app/client/' + name + '/main.js\'] );' );
        } );
    } );

    var apps = fs.readdirSync( 'app/client' ).filter( function( x ){
        return x !== 'config.js'
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
        cssminTask = {},
        cleanTask = {};


    cleanTask.files = apps.map( function( x ){
        return 'app/public/' + x + '.*'
    } );
    cleanTask.files.push( 'app/public/require.js' );
    

    apps.forEach( function( x ){

        requirejsTask[ x ] = {
            options: {
                baseUrl: './',
                name: 'app/client/' + x + '/main',
                mainConfigFile: 'app/client/config.js',
                out: 'app/public/' + x + '.js',
                optimize: 'none'
            }
        };


        uglifyTask[ x ] = {
            src: 'app/public/' + x + '.js',
            dest: 'app/public/' + x + '.js'
        };


        lessTask[ x ] = {
            src: 'app/client/' + x + '/main.less',
            dest: 'app/public/' + x + '.css'
        };


        cssminTask[ x ] = {
            src: 'app/public/' + x + '.css',
            dest: 'app/public/' + x + '.css'
        };

    } );


    uglifyTask.requirejs = {
        src: 'bower_components/requirejs/require.js',
        dest: 'app/public/require.js'
    };



    grunt.initConfig( {

        clean: cleanTask,
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