var mongoose = require( 'mongoose' ),
    passport = require( 'passport' ),
    LocalStrategy = require( 'passport-local').Strategy,
    BaiduStrategy = require( 'passport-baidu').Strategy;

var User = mongoose.model( 'user' );

passport.serializeUser( function( user, done ) {
    done( null, user.id );
} );

passport.deserializeUser( function( id, done ) {
    User.findById( id, function ( err, user ) {
        done( err, user );
    } );
} );

passport.use(
    new LocalStrategy( {
        usernameField: 'username',
        passwordField: 'password'
    },
    function( username, password, done ) {
        var conditions = {};
        if( /^(?:[a-zA-Z0-9]+[_\-\+\.]?)*[a-zA-Z0-9]+@(?:([a-zA-Z0-9]+[_\-]?)*[a-zA-Z0-9]+\.)+([a-zA-Z]{2,})+$/.test( username ) ){
            conditions.email = username;
        }else{
            conditions.username = username;
        }
        User.findOne( conditions, function ( err, user ) {
            if ( err ) { return done( err ) }
            if ( !user) {
                return done( null, false, { message: 'Unknown user' } );
            }
            if ( !user.authenticate( password ) ) {
                return done( null, false, { message: 'Invalid password' } )
            }
            return done( null, user );
        } );
    }
) );

passport.use(
    new BaiduStrategy( {
        clientID: enen.auth.baidu.clientID,
        clientSecret: enen.auth.baidu.clientSecret,
        callbackURL: enen.auth.baidu.callbackURL
    },
    function( token, tokenSecret, profile, done ) {

        profile._json.id = profile.id;

        User.findOrCreate( { 'baidu.id': profile.id }, { baidu: profile._json, username: profile.username, authToken: token }, { upsert: true }, function ( err, user ) {
            return done( err, user );
        } );

    }
) );

module.exports = passport;