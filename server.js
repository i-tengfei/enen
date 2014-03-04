var fs = require( 'fs' ),
    exec = require('child_process').exec;
// for openshift and heroku
if( process.env.DATABASE_PRODUCTION && process.env.DATABASE_DEVELOPMENT ){

    process.env.ENEN_PORT = 5000;

    fs.writeFileSync( './server/database.production', process.env.DATABASE_PRODUCTION );
    fs.writeFileSync( './server/database.development', process.env.DATABASE_DEVELOPMENT );

    exec( './node_modules/bower/bin/bower install', { cwd: './' }, function ( e ) {

        e && console.log( e );

        exec( './node_modules/grunt-cli/bin/grunt', { cwd: './' }, function ( e ) {

            e && console.log( e );
            start( );

        } );

    } );
}else{
    start( );
}

function start( ){
    process.env.NODE_ENV = 'production';
    require( './server/app' );
}