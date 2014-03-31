var request = require( 'request' ),
    path = require( 'path' ),
    mkdirp = require( 'mkdirp' ),
    fs = require( 'fs' );

function Cache( dir, time ){
    this.dir = path.normalize( dir );
    this.time = time || 3 * 24 * 60 * 60 * 1000;
}

Cache.prototype = {
    url: function( url, options, callback ){
        
        if( !options.name ){
            options.name = path.basename( url );
        }

        var dir = this.dir + '/' + options.name,
            time = this.time;


        mkdirp( this.dir, function( ){

            fs.exists( dir, function( f ){
                if( f ){
                    fs.stat( dir, function( err, stats ){
                        if( Date.now( ) - stats.mtime > this.time ){
                            fs.unlink( dir, function( ){
                                wirteFile( url, dir, callback );
                            } )
                        }else{
                            callback( null, dir );
                        }
                    } );
                }else{
                    wirteFile( url, dir, callback );
                }
            } )

        } )


    }
};

function wirteFile( url, dir, callback ){
    var fileStream = fs.createWriteStream( dir );
    fileStream.on( 'close', function( ){
        callback( null, dir );
    } );
    request( url ).pipe( fileStream );
}

module.exports = Cache;