require( [ 'jquery', 'codemirror', 'markdown', 'angular', 'angular-bootstrap', 'angular-resource', 'angular-route', 'client/gallery/common' ], function ( $, CodeMirror, markdown, angular ) {

    // 滚动条
    $( '#main' ).niceScroll( {
        cursoropacitymin: 1,
        mousescrollstep: 50
    } );

    // 按钮点击
    $( '#main' ).on( 'click', 'input[data-loading-text], button[data-loading-text], a[data-loading-text]', function ( ) {
        $( this ).button( 'loading' );
    } );

    // 菜单展开切换
    $( '#menu-toggle' ).on( 'click', function( ){
        if( $( '#menu' ).hasClass( 'menu-show' ) ){
            $( '#menu' ).removeClass( 'menu-show' ).addClass( 'menu-hide' );
            $( '#container' ).css( 'padding-left', 40 );
        } else {
            $( '#menu' ).removeClass( 'menu-hide' ).addClass( 'menu-show' );
            $( '#container' ).css( 'padding-left', 200 );
        }
    } );

    $( '#container' ).css( 'padding-left', $( '#menu' ).hasClass( 'menu-show' ) ? 200 : 40 );

    function navActive( id ){
        $( '#menu .nav li' ).removeClass( 'active' );
        $( '#nav-item-' + id ).addClass( 'active' );
    }

    angular.module( 'dashboard', [ 'ngResource', 'ngRoute', 'ui.bootstrap' ] )
    .factory( 'ArticleModel', [ '$resource', function( $resource ) {
        return $resource( '/api/article/:id', { id: '@_id' }, {
            'update': { method: 'PUT' }
        } );
    } ] )
    .factory( 'CodeModel', [ '$resource', function( $resource ) {
        return $resource( '/api/code/:id', { id: '@id' }, {
            'update': { method: 'PUT' }
        } );
    } ] )
    .factory( 'ShowModel', [ '$resource', function( $resource ) {
        return $resource( '/api/show/:id', { id: '@_id' }, {
            'update': { method: 'PUT' }
        } );
    } ] )
    .config( [ '$routeProvider', '$locationProvider', function( $routeProvider, $locationProvider ) {
    
        $locationProvider.html5Mode( true );
        $routeProvider
        .when( '/:enen', {
            controller: 'MainCtrl',
            templateUrl: function( params ){
                navActive( 'main' );
                return '/' + params.enen + '-tpl/main'
            }
        } )
        .when( '/:enen/article', {
            controller: 'ArticleListCtrl',
            templateUrl: function( params ){
                navActive( 'article' );
                return '/' + params.enen + '-tpl/article-list'
            }
        } )
        .when( '/:enen/article/:id', {
            controller: 'ArticleEditCtrl',
            templateUrl: function( params ){
                navActive( 'article' );
                return '/' + params.enen + '-tpl/article-edit'
            }
        } )
        .when( '/:enen/code', {
            controller: 'CodeListCtrl',
            templateUrl: function( params ){
                navActive( 'code' );
                return '/' + params.enen + '-tpl/code-list'
            }
        } )
        .when( '/:enen/code/:id', {
            controller: 'CodeEditCtrl',
            templateUrl: function( params ){
                navActive( 'code' );
                return '/' + params.enen + '-tpl/code-edit'
            }
        } )
        .when( '/:enen/setting', {
            controller: 'SettingCtrl',
            templateUrl: function( params ){
                navActive( 'setting' );
                return '/' + params.enen + '-tpl/setting'
            }
        } )
        .when( '/:enen/show', {
            controller: 'ShowListCtrl',
            templateUrl: function( params ){
                navActive( 'show' );
                return '/' + params.enen + '-tpl/show-list'
            }
        } )

    } ] )
    .controller( 'MainCtrl', [ '$scope', function( $scope ) {

    } ] )
    .controller( 'ArticleListCtrl', [ '$scope', 'ArticleModel', function( $scope, ArticleModel ) {

        $scope.init = function( ){
            $scope.list( );
        }

        $scope.list = function( event ) {
            event && $( event.currentTarget ).addClass( 'disabled' );
            ArticleModel.query( function( articles ) {
                $scope.articles = articles;
                event && $( event.currentTarget ).removeClass( 'disabled' );
            } );
        };

        $scope.remove = function( article ) {
            var articles = $scope.articles;
            if( confirm( '确定删除？' ) ) article.$remove( function( x ){
                articles.splice( articles.indexOf( x ), 1 );
            } );
        };

    } ] )
    .controller( 'ArticleEditCtrl', [ '$scope', '$location', '$routeParams', 'ArticleModel', function( $scope, $location, $routeParams, ArticleModel ){

        $scope.init = function( ) {

            if( $routeParams.id === 'new' ){
                $scope.article = new ArticleModel( );
                $scope.code( '' );
            }else{
                ArticleModel.get( {
                    id: $routeParams.id
                } , function( article ) {
                    $scope.article = article;
                    $scope.code( article.content );
                } );
            }

        };

        $scope.code = function( value ){
            var codeMirror = $scope.codeMirror = CodeMirror( $( '#codemirror' )[ 0 ], {
                mode: 'markdown',
                value: value,
                lineWrapping: true
            } );
        };

        $scope.save = function( event ) {
            event && $( event.currentTarget ).addClass( 'disabled' );
            $scope.article.content = $scope.codeMirror.getValue( );
            $scope.article.$save( function( article ){
                $location.path( '/' + $routeParams.enen + '/article' );
            } );
        };

    } ] )
    .controller( 'CodeListCtrl', [ '$scope', 'CodeModel', function( $scope, CodeModel ){

        $scope.init = function( ){
            $scope.list( );
        };

        $scope.list = function( event ){
            event && $( event.currentTarget ).addClass( 'disabled' );
            CodeModel.query( function( codes ) {
                $scope.codes = codes;
                event && $( event.currentTarget ).removeClass( 'disabled' );
            } );
        };

    } ] )
    .controller( 'CodeEditCtrl', [ '$scope', 'CodeModel', '$routeParams', function( $scope, CodeModel, $routeParams ){

        $scope.init = function( ){

            if( $routeParams.id === 'new' ){
                // $scope.article = new ArticleModel( );
                // $scope.code( '' );
            }else{
                CodeModel.get( {
                    id: $routeParams.id
                } , function( code ) {
                    $scope.code = code;
                } );
            }

        };

        $scope.codemirror = function( filename, file ){

            $scope.codemirrors = {};
            setTimeout( function( ){
                $scope.codemirrors[ file.filename ] = new CodeMirror( $( '#filename-' + filename )[ 0 ], {
                    value: file.content,
                    mode: file.type,
                    lineWrapping: true
                } )
            } );

        };

        $scope.save = function( event ){

            $scope.code.files = ( function( ){

                var files = {};

                $( '.file' ).each( function( ){
                    var $fname = $( this ).find( 'input' ),
                        ofname = $fname.attr( 'filename' );
                    files[ ofname ] = {
                        filename: $fname.val( ),
                        content: $scope.codemirrors[ ofname ].getValue( )
                    };
                } );

                return files;

            } )( );

            $scope.code.$save( function( code ){
                $( event.currentTarget ).button( 'reset' );
            } );

        };

    } ] )
    .controller( 'SettingCtrl', [ '$scope', function( $scope ){
        
        $scope.site = {};
        $scope.email = {};
        $scope.auth = {};

        $scope.init = function( ){

        };

        $scope.save = function( event ){
            event && $( event.currentTarget ).addClass( 'disabled' );
            $.ajax( {
                url: '/api/enen',
                type: 'put',
                data: { site: $scope.site, email: $scope.email, auth: $scope.auth }
            } ).done( function( ){
                event && $( event.currentTarget ).removeClass( 'disabled' );
            } )
        };     

    } ] )
    .controller( 'ShowListCtrl', [ '$scope', function( $scope ){
        
        $scope.init = function( ){

        };

    } ] );

    // requirejs的加载执行顺序与angular解析顺序有冲突，我们自己初始化
    angular.element( document ).ready( function( ) {
        angular.bootstrap( document, [ 'dashboard' ] );
    } );

} );