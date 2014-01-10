require( [ 'jquery', 'markdown', 'codemirror.markdown', 'markdown' ], function ( $, markdown, CodeMirror, markdown ) {

    var delay = ( function( ){
        var t;
        return function( fn, s ){
            clearTimeout( t );
            t = setTimeout( fn, s * 1000 );
        }
    } )( )

    var codeMirror = CodeMirror( $( '#editor' )[0], {
        value: 'test',
        mode: 'markdown'
    } );

    codeMirror.on( 'change', render );

    function render( ){
        delay( function( ){
            $( '#markdown' ).html( markdown.parse( codeMirror.getValue( ) ) );
        }, .5 )
    }

    render( );

} );