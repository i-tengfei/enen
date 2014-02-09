require( [ 'jquery', 'markdown', 'codemirror.markdown', 'client/gallery/code' ], function ( $, markdown, CodeMirror, code ) {

    var delay = ( function( ){
        var t;
        return function( fn, s ){
            clearTimeout( t );
            t = setTimeout( fn, s * 1000 );
        }
    } )( )

    var codeMirror = CodeMirror( $( '#codemirror' )[0], {
        value: 'test',
        mode: 'markdown'
    } );

    codeMirror.on( 'change', render );

    function render( ){
        delay( function( ){
            $( '#markdown' ).html( markdown.parse( codeMirror.getValue( ) ) );
            code( );
        }, .5 );
    }

    render( );

} );