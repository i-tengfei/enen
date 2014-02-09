define( [ 'jquery', 'codemirror.javascript', 'codemirror.python' ], function ( $, CodeMirror ) {

    function code( dom, modle ){

        var v = dom.innerText.trimRight( );
        dom.innerText = '';
        CodeMirror( dom, {
            readOnly: true,
            value: v,
            modle: modle,
            theme: 'ambiance',
            lineNumbers: v.indexOf( '\n' ) !== -1,
            lineWrapping: true,
            dragDrop: false,
            indentUnit: 4,
            smartIndent: false,
            viewportMargin: Infinity
        } );

    }

    return function ( ){

        $( 'pre code' ).each( function( ){
            var box = $( this );
            if( box.hasClass( 'lang-javascript' ) ){
                code( this, 'javascript' );
            }else if( box.hasClass( 'lang-python' ) ){
                code( this, 'python' );
            }else{
                code( this, 'html' );
            }
        } )

    }

} );