define( [ 'jquery', 'angular', 'angular-resource', 'angular-route', './common' ], function ( $, angular ) {

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

    } );
    

    // Angular
    angular.module( 'enen', [ 'ngResource', 'ngRoute' ] )
    .factory( 'ArticleModel', [ '$resource', function( $resource ) {
        return $resource( '/api/article/:id', { id: '@_id' } );
    } ] )
    .config( [ '$routeProvider', '$locationProvider', function( $routeProvider, $locationProvider ) {
    
        $locationProvider.html5Mode( true );
        $routeProvider
        .when( '/article', {
            controller: 'ArticleListCtrl',
            templateUrl: function( params ){
                navActive( 'article' );
                return '/tpl/article-list'
            }
        } )

    } ] )
    .controller( 'ArticleListCtrl', [ '$scope', 'ArticleModel', function( $scope, ArticleModel ) {

        $scope.init = function( ){
            $scope.list( );
        }

        $scope.list = function( ) {
            ArticleModel.query( function( articles ) {
                $scope.articles = articles;
            } );
        };

    } ] )

    // requirejs的加载执行顺序与angular解析顺序有冲突，我们自己初始化
    angular.element( document ).ready( function( ) {
        angular.bootstrap( document, [ 'enen' ] );
    } );

} );