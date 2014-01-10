var mongoose = require( 'mongoose' ),
    _ = require( 'underscore' );

function Controller( id ){

    var model = mongoose.model( id );

    return {

        create: function( req, res, next ){

            var entity = new model( req.body );

            entity.save( function ( err, result ) {

                req.result = result;
                next( err );
                
            } );

        },

        delete: function( req, res, next ){

            var entity = req.result;

            entity.remove( function( err, result ){

                delete req.result;
                next( err );

            } );

        },

        update: function( req, res, next ){

            var entity = req.result;
            entity = _.extend( entity, req.body );

            entity.save( function( err, result ){

                req.result = result;
                next( err );

            } );

        },

        load: function( req, res, next ){

            model.load( req.params.id, function ( err, result ) {

                if ( err ) return next( err );
                if ( result ){
                    req.result = result;
                    next( );
                }else{
                    next( new Error( 404 ) );
                }

            } );

        },

        list: function( req, res, next ){

            var page = ( req.param( 'page' ) > 0 ? req.param( 'page' ) : 1 ) - 1;
            var count = 20;
            var options = {
                count: count,
                page: page
            };

            model.list( options, function( err, results ) {

                model.count( ).exec( function ( err, count ) {
                    
                    req.result = results;
                    next( err );

                } );

            } );

        }

    }

}

module.exports = Controller;