var fs = require( 'fs' ),
    exec = require('child_process').exec;

// for openshift and heroku
if( process.env.DATABASE_PRODUCTION && process.env.DATABASE_DEVELOPMENT ){

    process.env.ENEN_PORT = process.env.PORT;
    process.env.ENEN_IP = process.env.IP;

    fs.writeFileSync( './server/database.production', process.env.DATABASE_PRODUCTION );
    fs.writeFileSync( './server/database.development', process.env.DATABASE_DEVELOPMENT );

}

process.env.NODE_ENV = 'production';
require( './server/app' );