var mongoose = require( 'mongoose' );

module.exports = function( ){

	mongoose.connect( config.db );
	var db = mongoose.connection;
	return db;

};