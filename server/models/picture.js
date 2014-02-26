var mongoose = require( 'mongoose' ),

    Schema = mongoose.Schema,
    crypto = require( 'crypto' );


var PictureSchema = new Schema( {

    name: { type: String },
    author: { type: Schema.ObjectId, ref : 'user' },
    createTime: { type : Date, default : Date.now( ) },
    updateTime: { type : Date, default : Date.now( ) }

} );

PictureSchema.set( 'toJSON',  {
    transform: function( doc, ret, options ) {
        delete ret.__v;
        return ret;
    }
} );

PictureSchema.statics = {

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
    }

};

mongoose.model( 'picture', PictureSchema, 'picture' );