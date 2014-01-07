var express = require( 'express' ),
	mongoStore = require( 'connect-mongo' )( express ),
	MemStore = express.session.MemoryStore;

module.exports = function( ){

	var app = express( );

	app.set( 'showStackError', true );
	app.set( 'views', config.base + '/../view/' + config.view );
	app.set( 'view engine', 'jade' );

	if ( config.type === 'development' ) {
		app.use( express.logger( 'dev' ) );
	}
	app.configure( function ( ) {

		app.use( express.cookieParser( ) );
		app.use( express.bodyParser( ) );
		app.use( express.methodOverride( ) );

		if( config.type === 'development' ){
			app.use( express.session( {
				secret: 'secret_key',
				store: MemStore( { reapInterval: 60000 * 10 } ) } 
			) );
		}else{		
			app.use( express.session( {
				secret: 'qazwsx',
				store: new mongoStore( {
					url: config.db,
					collection : 'sessions'
				} )
			} ) );
		}

		// app.use( passport.initialize( ) );
		// app.use( passport.session( ) );

		app.use( app.router );

		app.use( express.static( config.base + '/../public' ) );

		if ( config.type === 'development' ) {
			app.use( '/client', express.static( config.base + '/../client' ) );
			app.use( '/bower_components', express.static( config.base + '/../../bower_components' ) );
		}else{
			app.use( '/', express.static( config.base + '/../dist' ) );
		}

		app.use( function( err, req, res, next ){
			if ( err.message ) {
				res.send( err.message, err.stack );
			}
		} );

		app.use( function( req, res, next ){
			res.send( 404 );
		} );

	} );

	require( './router' )( app );

	app.listen( config.port );

	return app;

};