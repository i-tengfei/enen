require( './global' );

//---------- database ---------- //
var db = require( './database' )( );
db.once( 'open', logger.info.bind( logger, '连接数据库成功！' ) );
db.on( 'error', logger.error.bind( logger, '连接数据库失败！' ) );


// ---------- server ---------- //
var app = require( './server' )( );
logger.info( '---------- 服务启动成功 ----------' );
logger.info( '    端口:' + config.port + '	环境:' + config.type );
logger.info( '    PID:' + process.pid );
logger.info( '----------------------------------' );
