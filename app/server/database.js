var mongoose = require( 'mongoose' );

require( './models/user' );
require( './models/article' );

module.exports = function( ){

	mongoose.connect( config.db );
	var db = mongoose.connection;
	return db;

};