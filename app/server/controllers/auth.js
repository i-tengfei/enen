// 登录
exports.yes = function ( req, res, next ){
    
    if( req.isAuthenticated( ) ){
        next( );
    }else{
        next( new Error( 401 ) );
    }

};

// 未登录
exports.no = function ( req, res, next ){
    
    if( !req.isAuthenticated( ) ){
        next( );
    }else{
        next( new Error( 401 ) );
    }

};