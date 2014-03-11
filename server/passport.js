var mongoose = require( 'mongoose' ),
    passport = require( 'passport' ),
    LocalStrategy = require( 'passport-local').Strategy,
    BaiduStrategy = require( 'passport-baidu').Strategy,
    GithubStrategy = require( 'passport-github').Strategy;

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
        
        profile.token = token;
        User.findOrCreate( { 'baidu.id': profile.id }, { baidu: profile, username: profile.username }, { upsert: true }, function ( err, user ) {
            return done( err, user );
        } );

    }
) );

passport.use(
    new GithubStrategy( {
        clientID: enen.auth.github.clientID,
        clientSecret: enen.auth.github.clientSecret,
        callbackURL: enen.auth.github.callbackURL
    },
    function( token, tokenSecret, profile, done ) {

        profile.token = token;

        User.findOne( { 'email': profile._json.email }, function( err, result ){
            if( result ){
                User.findOrCreate( { '_id': result._id }, { github: profile }, { upsert: true }, function ( err, user ) {
                    return done( err, user );
                } );
            }else{
                User.findOrCreate( { 'github.id': profile.id }, { github: profile, username: profile.username, email: profile._json.email }, { upsert: true }, function ( err, user ) {
                    return done( err, user );
                } );
            }
        } );


    }
) );

module.exports = passport;