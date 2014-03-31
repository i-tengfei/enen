var Controller = require( './controllers/controller' ),
    enen = Controller( 'enen' ),
    user = Controller( 'user' ),
    article = Controller( 'article' ),
    picture = Controller( 'picture' ),
    auth = require( './controllers/auth' ),
    Github = require( 'github-api' ),
    gravatar = require( 'gravatar' ),
    Cache = require( './cache' ),
    fs = require( 'fs-extra' );

module.exports = function ( app, passport ) {

    var avatarCache = new Cache( config.cache + '/avatar' );

    app.save = function( methods, url, middleware, callback ){
        methods.forEach( function( x ){
            app[ x ]( url, middleware, callback );
        } );
    };

    // ========== ========== ======== ========== ========== //
    // ---------- ---------- | EnEn | ---------- ---------- //
    // ========== ========== ======== ========== ========== //
    // 查
    app.get( '/api/enen', [ auth.yes,/* auth.admin,*/ enen.load ], function( req, res ){
        global.enen = req.result.toJSON( );
        app.locals( global.enen );
        res.send( global.enen );
    } );
    // 改
    app.save( [ 'put', 'post' ], '/api/enen', [ auth.yes,/* auth.admin,*/ enen.load, enen.update ], function( req, res ){
        global.enen = req.result.toJSON( );
        app.locals( global.enen );
        res.send( global.enen );
    } );

    // ========== ========== ======== ========== ========== //
    // ---------- ---------- | Auth | ---------- ---------- //
    // ========== ========== ======== ========== ========== //
    // 登录
    app.post( '/login', auth.no, function( req, res, next ) {

        passport.authenticate( 'local', function( err, user, info ) {
            if( user ){
                req.result = user;
                req.login( user, function( err ){
                    res.send( req.user );
                } );
            }else{
                next( error( 403, '用户名或密码不正确！' ) );
            }
        } )( req, res );

    } );
    // 注册
    app.post( '/signup', [ auth.no, user.create ], function( req, res, next ) {
        req.login( req.result, function( err ){
            holder( err, function( ){
                next( err );
            }, function( ){
                res.send( req.user );
            } )
        } );
    } );
    // 退出
    app.all( '/logout', auth.yes, function( req, res ){
        req.logout( );
        res.redirect( '/' );
    } );

    // ---------- Auth2.0 ---------- //
    // 百度认证
    app.get( '/auth/baidu', passport.authenticate( 'baidu', {
        scope: [],
        failureRedirect : '/login'
    } ), function( req, res ){} );

    app.get( app.locals.auth.baidu.callbackURL, passport.authenticate( 'baidu', {
        failureRedirect: '/login'
    } ), function( req, res ) {
        res.send( req.user );
    } );
    
    // Github认证
    app.get( '/auth/github', passport.authenticate( 'github', {
        scope: [ 'gist' ],
        failureRedirect : '/login'
    } ), function( req, res ){} );

    app.get( app.locals.auth.github.callbackURL, passport.authenticate( 'github', {
        failureRedirect: '/login'
    } ), function( req, res ) {
        res.send( req.user );
    } );

    // ========== ========== ======== ========== ========== //
    // ---------- ---------- | User | ---------- ---------- //
    // ========== ========== ======== ========== ========== //
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
    app.get( '/api/user/:id/code', user.load, function( req, res ){

        if( req.result.github ){
            var github = new Github( {
                token: req.result.github.token
            } );
            github.getUser( ).userGists( req.result.username, function( err, gists ){
                res.send( gists );
            } );
        }else{
            next( error( 404, '无内容' ) );
        }

    } );
    app.get( '/api/user/:id/avatar/:size', user.load, function( req, res ){
        // TODO: cache
        var size = req.params.size;
        avatarCache.url( gravatar.url( req.result.email, { s: size, r: 'x', d: 'retro' } ), {
            name: req.result._id + '-' + size + '.jpg'
        }, function( err, dir ){
            res.sendfile( dir );
        } );
    } );

    // ========== ========== =========== ========== ========== //
    // ---------- ---------- | Article | ---------- ---------- //
    // ========== ========== =========== ========== ========== //
    // 列表
    app.get( '/api/article', article.list, function( req, res ){
        res.send( req.result );
    } );
    app.get( '/api/article/:page', article.list, function( req, res ){
        res.send( req.result );
    } );
    // 增
    app.post( '/api/article', [ auth.yes, function( req, res, next ){
        req.body.author = req.user;
        next( );
    }, article.create ], function( req, res ){
        res.send( req.result );
    } );
    // 删
    app.del( '/api/article/:id', [ auth.yes, article.load, auth.author, article.delete ], function( req, res ){
        res.send( {} );
    } );
    // 改
    app.save( [ 'put', 'post' ], '/api/article/:id', [ auth.yes, article.load, auth.author, article.update ], function( req, res ){
        res.send( req.result );
    } );
    // 查
    app.get( '/api/article/:id', article.load, function( req, res ){
        res.send( req.result );
    } );

    // ========== ========== ======== ========== ========== //
    // ---------- ---------- | Code | ---------- ---------- //
    // ========== ========== ======== ========== ========== //
    app.get( '/api/code', [ auth.yes, auth.github ], function( req, res, next ){
        req.github.getUser( ).userGists( req.user.username, function( err, result ){
            res.send( result );
        } );
    } );
    app.get( '/api/code/:num', [ auth.yes, auth.github ], function( req, res, next ){
        req.github.getGist( req.params.num ).read( function( err, result ){
            res.send( result );
        } );
    } );
    // 改
    app.save( [ 'put', 'post' ], '/api/code/:num', [ auth.yes, auth.github ], function( req, res, next ){
        req.github.getGist( req.params.num ).update( req.body, function( err, result ){
            if( err ){
                res.send( 401, 'Github未返回内容！' );
            }else{
                res.send( result );
            }
        } );
    } );

    // ========== ========== =========== ========== ========== //
    // ---------- ---------- | Picture | ---------- ---------- //
    // ========== ========== =========== ========== ========== //
    app.post( '/api/picture', [ auth.yes, picture.create, function( res, req, next ){
        fs.copy( tmpPath, config.upload + '/picture/original/' + req.result._id, function( err ){
            req.result.src = '/file/picture/' + req.result._id;
            next( err );
        } );
    } ], function( req, res ){
        res.send( req.result );
    } );

    // ========== ========== ======== ========== ========== //
    // ---------- ---------- | File | ---------- ---------- //
    // ========== ========== ======== ========== ========== //
    app.get( '/file/picture/:id', function( req, res ){

        var picture = config.upload + '/picture/original/' + req.params.id;
        // 判断文件是否存在
        fs.exists( picture, function( bool ){
            if( bool ){
                // 判断文件状态
                fs.stat( picture, function( err, stats ){
                    stats.isFile( ) ? res.sendfile( picture ) : res.send( 404 );
                } );
            }else{
                res.send( 404 );
            }
        } );

    } );

};