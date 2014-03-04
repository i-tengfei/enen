var path = require( 'path' ),
    fs = require( 'fs-extra' ),
    _ = require( 'underscore' );

var auth = {
    baidu: {
        clientID: 'abcdefg',
        clientSecret: 'abcdefg',
        callbackURL: 'abcdefg'
    }
};

var basic = {
    view: 'enen',
    dashboard: '/enen',

    auth: auth,
    base: path.normalize( __dirname ),
    cache: path.normalize( __dirname + '/../../cache' ),
    upload: path.normalize( __dirname + '/../../upload' )
};



var config = {

    development: _.extend( {
        
        type: 'development',
        port: process.env.OPENSHIFT_NODEJS_PORT || 3000,
        ip: process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1',
        db: fs.readFileSync( __dirname + '/database.development', 'utf8' ).trim( )
    }, basic ),

    testing: {},

    production: _.extend( {

        type: 'production',
        port: process.env.OPENSHIFT_NODEJS_PORT || 8001,
        ip: process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1',
        db: fs.readFileSync( __dirname + '/database.production', 'utf8' ).trim( )

    }, basic ),
    
};

module.exports = function( type ) {
    return config[ type || process.env.NODE_ENV || 'development' ];
};

module.exports.data = config;
