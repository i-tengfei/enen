var markdown = require( '../../bower_components/marked' ),
    Controller = require( './controllers/controller' ),
    user = Controller( 'user' ),
    article = Controller( 'article' ),
    auth = require( './controllers/auth' ),
    _ = require( 'underscore' );

module.exports = function ( app ) {
    
    var path = config.type === 'development' ? '/client/' + config.view + '/' : '/';
    var data = {
        config: config
    };

    app.get( '/', function( req, res ){

        res.render( 'index', _.extend( data, {
            path: path + 'index'
        } ) );

    } );

    app.get( '/login', auth.no, function( req, res ){

        res.render( 'login', _.extend( data, {
            path: path + 'login'
        } ) );

    } );

    app.get( '/signup', auth.no, function( req, res ){

        res.render( 'signup', _.extend( data, {
            path: path + 'signup'
        } ) );

    } );

    app.get( '/:id', article.load, function( req, res ){

        req.result.content = markdown.parse( req.result.content );
        res.render( 'article', _.extend( data, _.extend( req.result, {
            path: path + 'article'
        } ) ) );

    } );

    app.get( config.admin, auth.yes, function( req, res ){

        res.render( 'admin', _.extend( data, {
            path: path + 'admin'
        } ) );

    } );

    app.get( config.admin + '/article', auth.yes, function( req, res ){

        res.render( 'admin-article', _.extend( data, {
            path: path + 'admin-article'
        } ) );

    } );

};