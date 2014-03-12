define( [ 'jquery', 'bootstrap', 'jquery.nicescroll' ], function ( $ ) {

    $( function( ){

        $( 'input[data-loading-text], button[data-loading-text], a[data-loading-text]' ).on( 'click', function ( ) {
            $( this ).button( 'loading' );
        } );


    } );

} );