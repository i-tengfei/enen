var Controller = require( './controllers/controller' ),
    user = Controller( 'user' ),
    article = Controller( 'article' ),
    auth = require( './controllers/auth' ),
    fs = require( 'fs-extra' );

module.exports = function ( app, passport ) {

    // ========== ========== ======== ========== ========== //
    // ---------- ---------- | Auth | ---------- ---------- //
    // ========== ========== ======== ========== ========== //
    // 登录
    app.post( '/login', auth.no, function( req, res ) {

        passport.authenticate( 'local', function( err, user, info ) {
            if( user ){
                req.result = user;
                req.login( user, function( err ){
                    res.send( req.user );
                } );
            }else{
                res.send( 404 );
            }
        } )( req, res );

    } );
    // 注册
    app.post( '/signup', [ auth.no, user.create ], function( req, res ) {
        req.login( req.result, function( err ){
            res.send( req.user );
        } );
    } );
    // 退出
    app.all( '/logout', auth.no, function( req, res ){
        req.logout( );
        res.redirect( '/' );
    } );

    // ---------- Auth2.0 ---------- //
    // 百度认证
    app.get( '/auth/baidu', passport.authenticate( 'baidu', {
        scope: [],
        failureRedirect : '/login'
    } ), function( req, res ){} );
    // 百度返回
    app.get( '/auth/baidu/callback', passport.authenticate( 'baidu', {
        failureRedirect: '/login'
    } ), function( req, res ) {
        res.send( req.user );
    } );

    // ========== ========== ======== ========== ========== //
    // ---------- ---------- | User | ---------- ---------- //
    // ========== ========== ======== ========== ========== //
    app.options( '/api/user', function( req, res ){ res.send( 200 ) } );
    app.options( '/api/user/:id', function( req, res ){ res.send( 200 ) } );

    // 列表
    app.get( '/api/user', user.list, function( req, res ){
        res.send( req.result );
    } );
    app.get( '/api/user/:page', user.list, function( req, res ){
        res.send( req.result );
    } );
    /*
    TODO: 用户的 增\删\改 部分暂时留空，等未来加入权限控制部分再说
    // 增
    app.post( '/api/user', [ auth.gteAdministrator, user.create ], function( req, res ){
        res.send( req.result );
    } );
    // 删
    app.del( '/api/user/:id', [ auth.gteAdministrator, user.load, user.delete ], function( req, res ){
        res.send( {} );
    } );
    // 改
    app.put( '/api/user/:id', [ auth.gteAdministrator, user.load, user.update ], function( req, res ){
        res.send( req.result );
    } );
    */
    // 查
    app.get( '/api/user/:id', user.load, function( req, res ){
        res.send( req.result );
    } );

    // ========== ========== =========== ========== ========== //
    // ---------- ---------- | Article | ---------- ---------- //
    // ========== ========== =========== ========== ========== //
    app.options( '/api/article', function( req, res ){ res.send( 200 ) } );
    app.options( '/api/article/:id', function( req, res ){ res.send( 200 ) } );

    // 列表
    app.get( '/api/article', article.list, function( req, res ){
        res.send( req.result );
    } );
    app.get( '/api/article/:page', article.list, function( req, res ){
        res.send( req.result );
    } );
    // TODO: 权限验证
    // 增
    app.post( '/api/article', [ auth.yes, article.create ], function( req, res ){
        res.send( req.result );
    } );
    // 删
    app.del( '/api/article/:id', [ auth.yes, article.load, auth.author, article.delete ], function( req, res ){
        res.send( {} );
    } );
    // 改
    app.put( '/api/article/:id', [ auth.yes, article.load, auth.author, article.update ], function( req, res ){
        res.send( req.result );
    } );

    // ========== ========== ======== ========== ========== //
    // ---------- ---------- | File | ---------- ---------- //
    // ========== ========== ======== ========== ========== //
    app.post( '/api/picture', auth.yes, function( req, res ){

        var tmpPath = req.files.picture.path;
        

    } );

};