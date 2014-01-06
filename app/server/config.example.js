var path = require( 'path' );

var email = {
	hosts : 'smtp.exmail.qq.com',
	port : '25',
	name : 'QQ',
	username : 'service@malubei.com',
	password : 'xxxxxx',
	nickname : '昵称'
};

var config = {

	development: {
		
		type: 'development',
		port: 3000,
		db: 'mongodb://username:password@localhost:27017/blog-development',

		email : email

	},

	testing: {},

	production: {

		type: 'production',
		port: 17001,
		db: 'mongodb://username:password@localhost:27017/blog-production',

		email : email

	}
	
};

module.exports = function( type ) {
	var data = config[ type || process.env.NODE_ENV || 'development' ];
	data.base = path.normalize( __dirname );
	return data;
};