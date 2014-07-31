var express = require( 'express' ),

    compress = require( 'compression' ),
    session = require( 'express-session' ),
    cookieParser = require( 'cookie-parser' ),
    bodyParser = require( 'body-parser' ),
    morgan  = require( 'morgan' ),

    passport = require( './passport' ),

    mongoStore = require( 'connect-mongo' )( session ),
    MemStore = session.MemoryStore;

module.exports = function( enen ){

    var app = express( );

    app.set( 'showStackError', true );
    app.set( 'views', config.root + '/../view/' + enen.site.view );
    app.set( 'view engine', 'jade' );

    app.locals = enen;
    
    app.use( compress( ) );     // 压缩
    app.use( cookieParser( ) ); // Cookie
    app.use( bodyParser( ) );   // Body

    if( config.type === 'development' ){

        app.use( morgan( { format: 'dev', immediate: true } ) );       // Logger
        app.use( session( {
            secret: 'secret_key',
            store: MemStore( { reapInterval: 60000 * 10 } ) } 
        ) );

    }else{

        app.use( session( {
            secret: 'qazwsx',
            store: new mongoStore( {
                url: config.db,
                collection : 'sessions'
            } )
        } ) );

    }

    app.use( passport.initialize( ) );
    app.use( passport.session( ) );

    app.param( function( name, fn ){
        if ( fn instanceof RegExp ) {
            return function( req, res, next, val ){
                var captures;
                if ( captures = fn.exec( String( val ) ) ) {
                    req.params[ name ] = captures;
                    next( );
                } else {
                    next( 'route' );
                }
            }
        }
    } );

    app.param( 'id', /^[a-z0-9]{24}$/ );
    app.param( 'page', /^\d$/ );

    require( './api' )( app, passport );
    require( './router' )( app );

    app.use( express.static( config.root + '/../public' ) );

    if ( config.type === 'development' ) {
        app.use( '/client', express.static( config.root + '/../client' ) );
    }
    app.use( '/bower_components', express.static( config.root + '/../bower_components' ) );
    app.use( '/', express.static( config.root + '/../dist' ) );

    app.use( function( err, req, res, next ){
        if ( err.message ) {
            // TODO: 不同的错误页面
            res.send( err.message, err.msg );
        }
    } );

    app.use( function( req, res, next ){
        res.send( 404 );
    } );

    config.ip ? app.listen( config.port, config.ip ) : app.listen( config.port );

    return app;

};