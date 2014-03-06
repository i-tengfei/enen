require( './global' );

//---------- database ---------- //
logger.info( '--------- 等待数据库连接 ---------' );
require( './database' )( function( enen, db ){

    logger.info( '--------- 连接数据库成功 ---------' );
    db.on( 'error', logger.error.bind( logger, '--------- 连接数据库失败 ---------' ) );
    //---------- server ---------- //
    require( './server' )( enen );
    logger.info( '---------- 服务启动成功 ----------' );
    config.ip && logger.info( '   IP  : ' + config.ip );
    logger.info( '    端口: ' + config.port );
    logger.info( '    环境: ' + config.type );
    logger.info( '    PID : ' + process.pid );
    logger.info( '----------------------------------' );

} );