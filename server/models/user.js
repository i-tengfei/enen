var mongoose = require( 'mongoose' ),

    Schema = mongoose.Schema,
    crypto = require( 'crypto' );


var UserSchema = new Schema( {

    username: { type: String, unique: true },
    password: { type: String },
    email: { type: String, unique: true },

    salt: { type: String, default: '' },
    
    baidu: {},
    github: {},
    
    createTime: { type : Date, default : Date.now( ) },
    updateTime: { type : Date, default : Date.now( ) },
    loggedTime: { type : Date, default : Date.now( ) }

} );

UserSchema.set( 'toJSON',  {
    transform: function( doc, ret, options ) {
       delete ret.password;
       delete ret.salt;
       delete ret.__v;
       ret.baidu && ( delete ret.baidu.token );
       ret.github && ( delete ret.github.token );
       return ret;
    }
} );

UserSchema.pre( 'save', function( next ) {
    
    if( !this.username ){
        next( error( 403, '用户名不能为空' ) );
    }else if( ( this.baidu && this.baidu.token ) || ( this.github && this.github.token ) ){
        next( );
    }else if( /[^\w\u4e00-\u9fa5_-]/.test( this.username ) ){
        next( error( 403, '用户名格式不正确' ) );
    }else if( !this.password ){
        next( error( 403, '密码不能为空' ) );
    }else if( this.password.length < 8 || this.password.length > 24 ){
        next( error( 403, '密码长度不正确' ) );
    }else if( !this.email ){
        next( error( 403, '邮箱不能为空' ) );
    }else if( !/^(?:[a-zA-Z0-9]+[_\-\+\.]?)*[a-zA-Z0-9]+@(?:([a-zA-Z0-9]+[_\-]?)*[a-zA-Z0-9]+\.)+([a-zA-Z]{2,})+$/.test( this.email ) ){
        next( error( 403, '邮箱格式不正确' ) );
    }else{ 
        this.salt = this.makeSalt( );
        this.password = this.encryptPassword( this.password );
        next( );
    }
    
} );

UserSchema.methods = {

    makeSalt: function ( ) {
       return Math.round( ( new Date( ).valueOf( ) * Math.random( ) ) ) + '';
    },

    // 加密密码
    encryptPassword: function ( password ) {
       return crypto.createHmac( 'sha1', this.salt ).update( password ).digest( 'hex' );
    },

    // 登录判断
    authenticate: function ( password ) {
       return this.encryptPassword( password ) === this.password;
    }

};

UserSchema.statics = {

    load: function ( id, cb ) {
       this.findById( id ).exec( cb );
    },

    list: function ( options, cb ) {
       var criteria = options.criteria || { };

       this.find( criteria )
         .sort( { _id: -1 } )
         .limit( options.count )
         .skip( options.count * options.page )
         .exec( cb );
    },

    findOrCreate: function findOrCreate( conditions, doc, options, callback ) {

        if ( arguments.length < 4 ) {
            if ( typeof options === 'function' ) {
                callback = options;
                options = {};
            } else if ( typeof doc === 'function' ) {
                callback = doc;
                doc = {};
                options = {};
            }
        }
        var self = this;

        this.findOne( conditions, function( err, result ) {
            if( err || result ) {
                if( options && options.upsert && !err ) {
                    self.update( conditions, doc, function( err, count ){
                        self.findOne( conditions, function( err, result ) {
                            callback( err, result, false );
                        } );
                    } )
                } else {
                    callback( err, result, false )
                }
            } else {
                for ( var key in doc ) {
                    conditions[ key ] = doc[ key ]; 
                }
                var obj = new self( conditions )
                obj.save( function( err ) {
                    callback( err, obj, true );
                } );
            }
        } );

    }

};

mongoose.model( 'user', UserSchema, 'user' );