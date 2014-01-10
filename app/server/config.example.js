var path = require( 'path' );

var email = {
    hosts : 'smtp.exmail.qq.com',
    port : '25',
    name : 'QQ',
    username : 'service@malubei.com',
    password : 'maervice123',
    nickname : '码路北'
};

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
        db: 'mongodb://username:password@localhost:27017/blog-development',
        view: 'enen',
        admin: '/admin',

        email: email,
        auth: auth

    },

    testing: {},

    production: {

        type: 'production',
        port: 17001,
        db: 'mongodb://username:password@localhost:27017/blog-development',
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