module.exports = function ( app ) {

	var path = config.type === 'development' ? '/client/' : '/';

	app.get( '/', function( req, res ){

		res.render( 'index', {
			path: path + 'index'
		} );

	} );

};