var path = require( 'path' ),
    fs = require( 'fs-extra' ),
    _ = require( 'underscore' );

var email = require( './email' );

var auth = {
    baidu: {
        clientID: 'abcdefg',
        clientSecret: 'abcdefg',
        callbackURL: 'abcdefg'
    }
};

var basic = {
    view: 'enen',
    admin: '/enen',

    email: email,
    auth: auth,
    base: path.normalize( __dirname ),
    cache: path.normalize( __dirname + '/../../cache' ),
    upload: path.normalize( __dirname + '/../../upload' )
};



var config = {

    development: _.extend( {
        
        type: 'development',
        port: 3000,
        db: fs.readFileSync( __dirname + '/database.development', 'utf8' )

    }, basic ),

    testing: {},

    production: _.extend( {

        type: 'production',
        port: 17001,
        db: fs.readFileSync( __dirname + '/database.production', 'utf8' )

    }, basic ),
    
};

module.exports = function( type ) {
    return config[ type || process.env.NODE_ENV || 'development' ];
};

module.exports.data = config;