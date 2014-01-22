// 作者
exports.author = function ( req, res, next ){
    
    if( req.result.author === req.user._id ){
        next( );
    }else{
        next( new Error( 401 ) );
    }

};

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