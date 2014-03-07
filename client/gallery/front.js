define( [ 'jquery', 'bootstrap', 'jquery.nicescroll' ], function ( $ ) {

    $( function( ){

        var $header = $( '#header' );

        function hide( ){
            $header.animate( {
                marginTop: hh
            }, function( ){
                $( '#login-panel,#signup-panel,#user-panel' ).hide( );
            } );
        }

        var hh = parseFloat( $header.css( 'margin-top' ) );

        $( 'html' ).niceScroll( {
            cursoropacitymin: 1,
            mousescrollstep: 50
        } )
        .scrollstart( function( e ){

            if( e.current.y > e.end.y ){
                parseFloat( $header.css( 'top' ) ) === 0 || $header
                .css( {
                    top: -parseFloat( $header.css( 'margin-top' ) ) - $header.height( )
                } ).stop( ).animate( {
                    top: 0
                } );
            }else{
                console.log( parseFloat( $header.css( 'margin-top' ) ) )
                $header.stop( ).animate( {
                    top: -parseFloat( $header.css( 'margin-top' ) ) - $header.height( )
                } );
            }

        } );

        $( '#nav-user' ).on( 'click', '#login-btn, #signup-btn, #user-btn', function( event ){
            $( '#login-panel, #signup-panel, #user-panel' ).hide( );
            switch( event.currentTarget.id ){
                case 'login-btn':
                    $( '#login-panel' ).show( )
                    break;
                case 'signup-btn':
                    $( '#signup-panel' ).show( )
                    break;
                case 'username-btn':
                    $( '#user-panel' ).show( )
                    break;
            }
            $header.animate( {
                marginTop: 0
            } );
        } );

        $( '#content' ).on( 'click', hide );

        $( '#header-login-form' ).on( 'submit', function( event ){
            event.stopPropagation( );
            $.ajax( {
                url: '/login',
                data: {
                    username: $( '#login-panel .username' ).val( ),
                    password: $( '#login-panel .password' ).val( )
                },
                type: 'post',
                dataType: 'json'
            } ).done( function( data ){
                hide( );
                $( '#nav-user' ).html( '<button id="user-btn" class="btn btn-default navbar-btn btn-sm">' + data.username + '</button>' );
            } );
        } );

    } );


} );