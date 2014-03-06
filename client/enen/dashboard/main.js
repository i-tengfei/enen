require( [ 'jquery', 'codemirror', 'markdown', 'angular', 'angular-bootstrap', 'angular-resource', 'angular-route', 'client/gallery/common' ], function ( $, CodeMirror, markdown, angular ) {

    $( '#container' ).css( 'padding-left', $( '#menu' ).hasClass( 'menu-show' ) ? 200 : 40 );
    
    $( '#menu-toggle' ).on( 'click', function( ){
        if( $( '#menu' ).hasClass( 'menu-show' ) ){
            $( '#menu' ).removeClass( 'menu-show' ).addClass( 'menu-hide' );
            $( '#container' ).css( 'padding-left', 40 );
        } else {
            $( '#menu' ).removeClass( 'menu-hide' ).addClass( 'menu-show' );
            $( '#container' ).css( 'padding-left', 200 );
        }
    } );

    angular.module( 'dashboard', [ 'ngResource', 'ngRoute', 'ui.bootstrap' ] )
    .factory( 'ArticleModel', [ '$resource', function( $resource ) {
        return $resource( '/api/article/:id', { id: '@_id' }, {
            'update': { method: 'PUT' }
        } );
    } ] )
    .config( [ '$routeProvider', '$locationProvider', function( $routeProvider, $locationProvider ) {
    
        $locationProvider.html5Mode( true );
        $routeProvider
        .when( '/:enen', {
            controller: 'MainCtrl',
            templateUrl: function( params ){
                return '/' + params.enen + '-tpl/main'
            }
        } )
        .when( '/:enen/article', {
            controller: 'ArticleListCtrl',
            templateUrl: function( params ){
                return '/' + params.enen + '-tpl/article-list'
            }
        } )
        .when( '/:enen/article/:id', {
            controller: 'ArticleEditCtrl',
            templateUrl: function( params ){
                return '/' + params.enen + '-tpl/article-edit'
            }
        } )
        .when( '/:enen/code', {
            controller: 'CodeListCtrl',
            templateUrl: function( params ){
                return '/' + params.enen + '-tpl/code-list'
            }
        } )
        .when( '/:enen/code/:id', {
            controller: 'CodeEditCtrl',
            templateUrl: function( params ){
                return '/' + params.enen + '-tpl/code-edit'
            }
        } )
        .when( '/:enen/setting', {
            controller: 'SettingCtrl',
            templateUrl: function( params ){
                return '/' + params.enen + '-tpl/setting'
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
    .controller( 'CodeListCtrl', [ '$scope', function( $scope ){

        $scope.init = function( ){
            $scope.list( );
        }

        $scope.list = function( event ){
            event && $( event.currentTarget ).addClass( 'disabled' );
            // ArticleModel.query( function( articles ) {
            //     $scope.articles = articles;
            //     event && $( event.currentTarget ).removeClass( 'disabled' );
            // } );
        }

    } ] )
    .controller( 'CodeEditCtrl', [ '$scope', function( $scope ){

        $scope.init = function( ){
        }

    } ] )
    .controller( 'SettingCtrl', [ '$scope', function( $scope ){
        
        $scope.init = function( ){
            
        }

    } ] );

    // requirejs的加载执行顺序与angular解析顺序有冲突，我们自己初始化
    angular.element( document ).ready( function( ) {
        angular.bootstrap( document, [ 'dashboard' ] );
    } );

} );