define( [ 'jquery', 'TWEEN', 'coo', 'angular', 'angular-resource', 'angular-route', 'client/gallery/common' ], function ( $, TWEEN, COO, angular ) {

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
        .when( '/', {
            controller: 'IndexCtrl',
            templateUrl: function( params ){
                return '/includes/index'
            }
        } )
        .when( '/article', {
            controller: 'ArticleListCtrl',
            templateUrl: function( params ){
                return '/includes/article-list'
            }
        } )

    } ] )
    .controller( 'IndexCtrl', [ '$scope', function( $scope ) {

    } ] )
    .controller( 'ArticleListCtrl', [ '$scope', 'ArticleModel', function( $scope, ArticleModel ) {

        var renderer = new COO.CSS3DRenderer( $( '#article-box' )[ 0 ] );

        var view = new COO.View( {
            width: 720,
            height: 1200
        } );

        view.camera.position.z = 1450 + 360;

        view.setRenderer( renderer );

        var box = new COO.Node( );

        var front = new COO.CSS3D( {
            element: $( '#front' )[ 0 ] 
        } );
        front.position.z = 360;

        var left = new COO.CSS3D( {
            element: $( '#left' )[ 0 ] 
        } );
        left.position.x = 360;
        left.rotation.y = Math.PI / 2;

        var right = new COO.CSS3D( {
            element: $( '#right' )[ 0 ] 
        } );
        right.position.x = -360;
        right.rotation.y = Math.PI / 2;

        var back = new COO.CSS3D( {
            element: $( '#back' )[ 0 ] 
        } );
        back.position.z = -360;

        box.add( front, left, right, back );
        view.add( box );

        // box.position.z = - 180;
        // setInterval( function( ){
        //     box.rotation.y += 0.01
        // } )

        function animate( ) {

            requestAnimationFrame( animate );
            TWEEN.update( );

        }

        animate( );


        $scope.init = function( ){
            $scope.list( );
        };

        $scope.list = function( ) {
            ArticleModel.query( function( articles ) {
                $scope.articles = articles;
                $( '#pillar, .article-face' ).height( 200 * articles.length );
                view.height = 200 * articles.length;
            } );
        };

        $scope.fy = function( ){

            var fy = new TWEEN.Tween( {v:0} ).to({v:1},500).onUpdate( function( v ){
                box.position.z = -180 * (1-v);
            } )
            var xz = new TWEEN.Tween( {v:0} ).to({v:1},500).onUpdate( function( v ){
                box.rotation.y = Math.PI * v * 0.5;
            } ).chain( fy )

            var tween = new TWEEN.Tween( {v:0} )
                .to( {v:1}, 300 )
                .onUpdate( function( v ){
                    box.position.z = -180 * v
                } )
                .chain( xz )
                .start( )
        };

    } ] )

    // requirejs的加载执行顺序与angular解析顺序有冲突，我们自己初始化
    angular.element( document ).ready( function( ) {
        angular.bootstrap( document, [ 'enen' ] );
    } );

} );