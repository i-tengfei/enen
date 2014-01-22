var path = require( 'path' ),
    fs = require( 'fs-extra' );

var email = require( './email' );

var auth = {
    baidu: {
        clientID: 'abcdefg',
        clientSecret: 'abcdefg',
        callbackURL: 'abcdefg'
    }
};

var config = {

    development: {
        
        type: 'development',
        port: 3000,
        db: fs.readFileSync( __dirname + '/database.development', 'utf8' ),
        view: 'enen',
        admin: '/admin',

        email: email,
        auth: auth

    },

    testing: {},

    production: {

        type: 'production',
        port: 17001,
        db: fs.readFileSync( __dirname + '/database.production', 'utf8' ),
        view: 'enen',
        admin: '/admin',

        email: email,
        auth: auth

    }
    
};

module.exports = function( type ) {
    var data = config[ type || process.env.NODE_ENV || 'development' ];
    data.base = path.normalize( __dirname );
    return data;
};

module.exports.data = config;