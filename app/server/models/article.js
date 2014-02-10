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
        this.findById( id ).populate( 'author' ).exec( cb );
    },

    list: function ( options, cb ) {
        var criteria = options.criteria || { };

        this.find( criteria )
            .populate( 'author' )
            .sort( { _id: -1 } )
            .limit( options.count )
            .skip( options.count * options.page )
            .exec( cb );
    }

};

mongoose.model( 'article', ArticleSchema, 'article' );