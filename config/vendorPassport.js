require('dotenv').config()    // for JWT password key

// used to create our local strategy for authenticating
// using username and password
const LocalStrategy = require('passport-local').Strategy;

// our vendor model
const { Vendor } = require('../models/vendor');

// the following is required IF you wanted to use passport-jwt
// JSON Web Tokens
const passportJWT = require("passport-jwt");
const JwtStrategy = passportJWT.Strategy;
const ExtractJwt = passportJWT.ExtractJwt;

module.exports = function(passport) {
    // these two functions are used by passport to store information
    // in and retrieve data from sessions. We are using vendor's object id
    passport.serializeUser(function(vendor, done) {
        done(null, vendor._id);
    });

    passport.deserializeUser(function(_id, done) {
        Vendor.findById(_id, function(err, vendor) {
            done(err, vendor);
        });
    });


    // strategy to login
    // this method only takes in username and password, and the field names
    // should match of those in the login form
    passport.use('local-login-vendor', new LocalStrategy({
            usernameField : 'vanname', 
            passwordField : 'password',
            passReqToCallback : true},// pass the req as the first arg to the callback for verification 
        function(req, vanname, password, done) {
            // you can read more about the nextTick() function here: 
            // https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/
            // we are using it because without it the Vendor.findOne does not work,
            // so it's part of the 'syntax'
            process.nextTick(function() {
                // see if the vendor with the vanname exists
                Vendor.findOne({ 'vanname' :  vanname }, function(err, vendor) {
                    // if there are errors, vendor is not found or password
                    // does match, send back errors
                    if (err)
                        return done(err);
                    if (!vendor)
                        return done(null, false, req.flash('loginMessage', 'No vendor found.'));
                    if (vendor.password != password){
                        console.log(password)
                        console.log(vendor.password)
                        // false in done() indicates to the strategy that authentication has
                        // failed
                        return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
                    }
                    // otherwise, we put the vendor's vanname in the session
                    else {
                        // in app.js, we have indicated that we will be using sessions
                        // the server uses the included modules to create and manage
                        // sessions. each client gets assigned a unique identifier and the
                        // server uses that identifier to identify different clients
                        // all this is handled by the session middleware that we are using 
                        req.session.vanname = vanname; // for demonstration of using express-session
                        // done() is used by the strategy to set the authentication status with
                        // details of the vendor who was authenticated
                        console.log("this vendor is authenticated")
                        console.log(vendor)
                        return done(null, vendor, req.flash('loginMessage', 'Login successful'));
                    }
                });
            });

        }));


    // used to demonstrate JWT
    let opts = {};
    // extract token information
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
    // key that was used to hash the token
    opts.secretOrKey = process.env.PASSPORT_KEY;

    // depending on what data you store in your token, setup a strategy
    // to verify that the token is valid....
    passport.use('jwt', new JwtStrategy(opts, (jwt_payload, done) => {

        // here I'm simply searching for a vendor with the vanname addr
        // that was added to the token
        Vendor.findOne({'vanname':jwt_payload.body._id}, (err, vendor) => {

            if(err){
                return done(err, false);
            }

            if(vendor){
                return done(null, vendor);
            } else {
                return done(null, false);
            }
        });
    }));

    //Create a passport middleware to handle Vendor login
    passport.use('login', new LocalStrategy({
        usernameField : 'vanname',
        passwordField : 'password'
    }, async (vanname, password, done) => {
        try {
            //Find the vendor associated with the vanname provided by the vendor
            Vendor.findOne({ 'vanname' :  vanname }, function(err, vendor) {
                if (err)
                    return done(err);
                if (!vendor)
                    return done(null, false, {message: 'No vendor found.'});

                if (!vendor.validPassword(password))
                    return done(null, false, {message: 'Oops! Wrong password.'});

                else {
                    return done(null, vendor, {message: 'Login successful'});
                }
            });
        } catch (error) {
            return done(error);
        }
    }));
};

