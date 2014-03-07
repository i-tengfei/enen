define( [ 'jquery', 'bootstrap', 'jquery.nicescroll' ], function ( $ ) {

    $( function( ){

        var $header = $( '#header' );

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

        $( '#login-btn, #signup-btn' ).on( 'click', function( event ){
            event.stopPropagation( );
            event.currentTarget.id === 'login-btn' ? $( '#login-panel' ).show( ) && $( '#signup-panel' ).hide( ) : $( '#signup-panel' ).show( ) && $( '#login-panel' ).hide( )
            $header.animate( {
                marginTop: 0
            } );
        } );

        $( '#content' ).on( 'click', function( ){
            $header.animate( {
                marginTop: hh
            }, function( ){
                $( '#login-panel,#signup-panel' ).hide( );
            } )
        } );

    } );


} );