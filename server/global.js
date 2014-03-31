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


Date.prototype.format = function (fmt) { //author: meizz 
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};