var mongoose = require( 'mongoose' );

var enen = require( './models/enen' );
require( './models/user' );
require( './models/article' );
require( './models/picture' );

module.exports = function( callback ){

    mongoose.connect( config.db );

    enen( function( result ){
        global.enen = result;
        callback( result, mongoose.connection );
    } )

};