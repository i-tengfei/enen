var mongoose = require( 'mongoose' ),

    Schema = mongoose.Schema,
    crypto = require( 'crypto' );


var ArticleSchema = new Schema( {

    title: { type: String },
    content: { type: String },
    author: { type: Schema.ObjectId, ref : 'user' },
    createTime: { type : Date, default : Date.now( ) },
    updateTime: { type : Date, default : Date.now( ) }

} );

ArticleSchema.set( 'toJSON',  {
    transform: function( doc, ret, options ) {
        delete ret.__v;
        return ret;
    }
} );

ArticleSchema.statics = {

    load: function ( id, cb ) {
        this.findById( id ).populate( 'author', '_id username' ).exec( cb );
    },

    list: function ( options, cb ) {
        var criteria = options.criteria || { };

        this.find( criteria )
            .populate( 'author', '_id username' )
            .sort( { _id: -1 } )
            .limit( options.count )
            .skip( options.count * options.page )
            .exec( cb );
    },

    random: function( callback ) {
        this.count( function( err, count ) {
            if ( err ) {
                return callback( err );
            }
            var rand = Math.floor( Math.random( ) * count );
            this.findOne( ).populate( 'author', '_id username' ).skip( rand ).exec( callback );
        }.bind( this ) );
    }

};

mongoose.model( 'article', ArticleSchema, 'article' );