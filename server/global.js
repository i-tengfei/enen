global.config = require( './config' )( process.argv[ 2 ] );

global.logger = require( 'tracer' ).colorConsole( {

    format: [
        '{{timestamp}} {{title}} {{message}}', {
            warn: '{{timestamp}} {{title}} {{message}}\n    {{file}}:{{line}}',
            error: '{{timestamp}} {{title}} {{message}}\n    {{file}}:{{line}}\n    Call Stack:{{stacklist}}'
        }
    ],

    dateformat: 'mm-dd HH:MM:ss',
    
    preprocess: function( data ){
        if( data.title === 'error' ){
            var callstack = '',
                len = data.stack.length;
            for( var i=0; i<len; i+=1 ){
                callstack += '\n    ' + data.stack[ i ];
            }
            data.stacklist = callstack;
        }
    }

} );

global.error = function( code, msg ){
    var err = new Error( code );
    err.msg = msg;
    return err;
};

global.holder = function( err, fn1, fn2 ){
    if( err ){
        fn1( )
    }else{
        fn2( );
    }
};