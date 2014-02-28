require( './global' );

//---------- database ---------- //
var db = require( './database' )( );
db.once( 'open', function ( ) {
    logger.info( '连接数据库成功！' );
    logger.info( '----------------------------------' );
} );
db.on( 'error', logger.error.bind( logger, '连接数据库失败！' ) );


// ---------- server ---------- //
var app = require( './server' )( );
logger.info( '---------- 服务启动成功 ----------' );
logger.info( '    端口:' + config.port + '	环境:' + config.type );
logger.info( '    IP  :' + config.ip + '    PID :' + process.pid );
logger.info( '----------------------------------' );
logger.info( '等待数据库连接...' );
