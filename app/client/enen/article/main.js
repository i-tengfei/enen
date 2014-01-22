require( [ 'jquery', 'codemirror.javascript' ], function ( $, CodeMirror ) {


    [].slice.call( $('.lang-javascript'), '' ).forEach( function( x ){

        var v = x.innerText;
        x.innerText = '';
        CodeMirror( x, {
            readOnly: true,
            value: v,
            modle: 'javascript'
        } )

    } )

} );