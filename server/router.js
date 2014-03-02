var markdown = require( '../bower_components/marked' ),
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

    app.get( '/', function( req, res, next ){
        
        article.Model.random( function( err, result ){
            result.content = markdown.parse( result.content );
            req.result = result;
            next( err );
        } )

    }, function( req, res ){

        res.render( 'index', _.extend( data, {
            path: path + 'index',
            title: '首页',
            article: req.result
        } ) );

    } );

    app.get( '/login', auth.no, function( req, res ){

        res.render( 'login', _.extend( data, {
            path: path + 'login',
            title: '登录'
        } ) );

    } );

    app.get( '/signup', auth.no, function( req, res ){

        res.render( 'signup', _.extend( data, {
            path: path + 'signup',
            title: '注册'
        } ) );

    } );

    app.get( '/article/:id', article.load, function( req, res ){

        req.result.content = markdown.parse( req.result.content );
        res.render( 'article', _.extend( data, _.extend( req.result, {
            path: path + 'article'
        } ) ) );

    } );

    app.get( '/article', article.list, function( req, res ){

        res.render( 'article-list', _.extend( data, {
            path: path + 'article-list',
            articles: req.result,
            title: '文章'
        } ) );

    } );

    app.get( [ config.dashboard, config.dashboard + '/*' ], auth.yes, function( req, res ){

        res.render( 'dashboard', _.extend( data, {
            path: path + 'dashboard',
            title: '控制台'
        } ) );

    } );

    app.get( config.dashboard + '-tpl/:tpl', auth.yes, function( req, res ){

        res.render( 'dashboard-includes/' + req.params.tpl, data );

    } );

};