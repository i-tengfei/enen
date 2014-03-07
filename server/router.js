var markdown = require( '../bower_components/marked' ),
    Controller = require( './controllers/controller' ),
    user = Controller( 'user' ),
    article = Controller( 'article' ),
    auth = require( './controllers/auth' ),
    _ = require( 'underscore' );

markdown.setOptions( {
    sanitize: true
} );

module.exports = function ( app ) {

    var path = config.type === 'development' ? '/client/' + app.locals.site.view + '/' : '/';

    app.get( '/', function( req, res, next ){
        
        article.Model.random( function( err, result ){
            result.content = markdown.parse( result.content );
            req.result = result;
            next( err );
        } );

    }, function( req, res ){

        res.render( 'index', {
            path: path + 'index',
            title: '首页',
            article: req.result,
            user: req.user
        } );

    } );

    app.get( '/login', auth.no, function( req, res ){

        res.render( 'login', {
            path: path + 'login',
            title: '登录'
        } );

    } );

    app.get( '/signup', auth.no, function( req, res ){

        res.render( 'signup', {
            path: path + 'signup',
            title: '注册'
        } );

    } );

    app.get( '/article/:id', article.load, function( req, res ){

        req.result.content = markdown.parse( req.result.content );
        res.render( 'article', _.extend( req.result, {
            path: path + 'article',
            user: req.user
        } ) );

    } );

    app.get( '/article', article.list, function( req, res ){

        res.render( 'article-list', {
            path: path + 'article-list',
            articles: req.result,
            title: '文章',
            user: req.user
        } );

    } );

    var dashboard = function( req, res ){

        res.render( 'dashboard', {
            path: path + 'dashboard',
            title: '控制台',
            user: req.user
        } );

    };

    app.get( app.locals.site.dashboard, auth.yes, dashboard );
    app.get( app.locals.site.dashboard + '/*', auth.yes, dashboard );

    app.get( app.locals.site.dashboard + '-tpl/:tpl', auth.yes, function( req, res ){

        res.render( 'dashboard-includes/' + req.params.tpl );

    } );

};