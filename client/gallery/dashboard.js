define( [ 'jquery', 'bootstrap' ], function ( $ ) {

    $( '#menu-toggle' ).on( 'click', function( ){
        if( $( '#menu' ).hasClass( 'menu-show' ) ){
            $( '#menu' ).removeClass( 'menu-show' ).addClass( 'menu-hide' );
            $( '#container' ).css( 'padding-left', 40 );
        } else {
            $( '#menu' ).removeClass( 'menu-hide' ).addClass( 'menu-show' );
            $( '#container' ).css( 'padding-left', 200 );
        }
    } );
    
} );