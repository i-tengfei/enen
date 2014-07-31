require( [ 'jquery', 'angular', 'markdown', 'client/gallery/code', 'angular-resource', 'angular-route', 'angular-sanitize', 'client/gallery/common' ], function ( $, angular, markdown, code ) {

    $( function( ){

        var $header = $( '#header' );

        var ht = -parseFloat( $header.css( 'margin-top' ) ),
            hh = ht + 50;

        function hide( t ){
            $header.animate( {
                marginTop: -ht
            }, t || 0, function( ){
                $( '#login-panel,#signup-panel,#user-panel' ).hide( );
            } );
        }


        $( 'html' ).niceScroll( {
            cursoropacitymin: 1,
            mousescrollstep: 50
        } )
        .scrollstart( function( e ){

            hide( 0 );

            if( e.current.y > e.end.y ){
                parseFloat( $header.css( 'top' ) ) === 0 || $header
                .css( {
                    top: ht - hh
                } ).stop( ).animate( {
                    top: 0
                }, 150 );
            }else{
                $header.stop( ).animate( {
                    top: ht - hh
                }, 150 );
            }

        } );

        $( '#nav-user' ).on( 'click', '#login-btn, #signup-btn, #user-btn', function( event ){
            $( '#login-panel, #signup-panel, #user-panel' ).hide( );
            switch( $( this ).attr( 'id' ) ){
                case 'login-btn':
                    $( '#login-panel' ).show( );
                    break;
                case 'signup-btn':
                    $( '#signup-panel' ).show( );
                    break;
                case 'user-btn':
                    $( '#user-panel' ).show( );
                    break;
            }
            $header.animate( {
                marginTop: 0
            }, 150 );
        } );

        $( '#content' ).on( 'click', function( ){
            hide( 150 );
        } );

        $( '#header-login-form' ).on( 'submit', function( event ){
            var btn = $( '#login-panel-btn' ).trigger( 'click' );
            event.preventDefault( );
            $.ajax( {
                url: '/login',
                data: {
                    username: $( '#login-panel .username' ).val( ),
                    password: $( '#login-panel .password' ).val( )
                },
                type: 'post',
                dataType: 'json'
            } ).done( function( data ){
                hide( 150 );
                $( '#nav-user' ).html( '<button id="user-btn" class="btn btn-default navbar-btn btn-sm">' + data.username + '</button>' );
            } ).fail( function( data ){
                alert( data.responseText + ' ( TODO: 弹框待优化 ) ' );
            } ).always( function( ){
                btn.button( 'reset' );
            } );
        } );

        // 头部游标
        function setCursorPos( w, l ){        
            var logo = $( '#name-logo' );
            $( '#nav-cursor' ).css( {
                width: w || logo.width( ),
                left: l || logo.offset( ).left + parseInt( logo.css( 'paddingLeft' ) )
            } );
        }
        setCursorPos( );
        $( '.navbar-nav li a' ).on( 'mouseenter', function( event ){
            var btn = $( event.currentTarget );
            setCursorPos( 
                btn.width( ) + 10,
                btn.offset( ).left + parseInt( btn.css( 'paddingLeft' ) ) - 5
            )
        } ).on( 'mouseleave', function( event ){
            setCursorPos( );
        } )

    } );

    // ---------- ---------- ---------- ---------- //
    //                   Angular
    // ---------- ---------- ---------- ---------- //
    angular.module( 'enen', [ 'ngResource', 'ngRoute', 'ngSanitize' ] )
    .factory( 'ArticleModel', [ '$resource', function( $resource ) {
        return $resource( '/api/article/:id', { id: '@_id' } );
    } ] )
    .config( [ '$routeProvider', '$locationProvider', function( $routeProvider, $locationProvider ) {
    
        $locationProvider.html5Mode( true );
        $routeProvider
        .when( '/', {
            controller: 'IndexCtrl',
            title: '敬请期待',
            type: 'index',
            templateUrl: '/front-view/index'
        } )
        .when( '/article', {
            controller: 'ArticleListCtrl',
            resolve: {
                articles: [ '$q', 'ArticleModel', function( $q, ArticleModel ){

                    var deferred = $q.defer( );

                    ArticleModel.query( function( articles ) {
                        deferred.resolve( articles );
                    } );

                    return deferred.promise;

                } ]
            },
            title: '文章',
            type: 'article-list',
            templateUrl: '/front-view/article-list'
        } )
        .when( '/article/:id', {
            controller: 'ArticleCtrl',
            resolve: {
                article: [ '$q', '$route', '$rootScope', 'ArticleModel', function( $q, $route, $rootScope, ArticleModel ){

                    var deferred = $q.defer( );

                    ArticleModel.get( {
                        id: $route.current.params.id
                    }, function( article ) {
                        $rootScope.title = article.title;
                        article.content = markdown( article.content );
                        deferred.resolve( article );
                    } );

                    return deferred.promise;

                } ]
            },
            title: '文章',
            type: 'article',
            templateUrl: '/front-view/article'
        } )

    } ] )
    .controller( 'IndexCtrl', [ '$scope', function ( $scope ) {} ] )
    .controller( 'ArticleListCtrl', [ '$scope', 'articles', function ( $scope, articles ) {
        $scope.articles = articles;
    } ] )
    .controller( 'ArticleCtrl', [ '$scope', 'article', function ( $scope, article ) {
        $scope.article = article;
        setTimeout( function( ){
            code( );
        }, 100 )
    } ] )
    .run( [ '$rootScope', '$route', function( $rootScope, $route ){
        
        $rootScope.$on( '$routeChangeSuccess', function( currentRoute, previousRoute ){
            $rootScope.title = $route.current.title;
            $rootScope.type = $route.current.type;
            $( 'html' ).getNiceScroll( ).resize( );
        } );

    } ] );

    // requirejs的加载执行顺序与angular解析顺序有冲突，我们自己初始化
    angular.element( document ).ready( function( ) {
        angular.bootstrap( document, [ 'enen' ] );
    } );

} );