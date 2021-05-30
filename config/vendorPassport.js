require('dotenv').config()    // for JWT password key

// used to create our local strategy for authenticating
// using username and password
const LocalStrategy = require('passport-local').Strategy;

// our vendor model
const { Vendor } = require('../models/vendor');

module.exports = function(passport) {
    // these two functions are used by passport to store information
    // in and retrieve data from sessions. We are using vendor's object id
    passport.serializeUser(function(vendor, done) {
        // console.log(vendor._id)
        // console.log("im in vendor")
        done(null, vendor._id);
    });

    passport.deserializeUser(function(_id, done) {
        // console.log(_id)
        Vendor.findById(_id, function(err, vendor) {
            done(err, vendor);
        });
    });


    // strategy to login
    // this method only takes in username and password, and the field names
    // should match of those in the login form
    passport.use('local-login-vendor', new LocalStrategy({
            usernameField : 'van_first_name',
            passwordField : 'van_last_name',
            passReqToCallback : true},// pass the req as the first arg to the callback for verification
        function(req, van_first_name, van_last_name, done) {
            // you can read more about the nextTick() function here:
            // https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/
            // we are using it because without it the Vendor.findOne does not work,
            // so it's part of the 'syntax'
            process.nextTick(function() {
                // see if the vendor with the vanname exists
                Vendor.findOne({ 'van_first_name' :  van_first_name }, function(err, vendor) {
                    // if there are errors, vendor is not found or password
                    // does match, send back errors
                    if (err)
                        return done(err);
                    if (!vendor)
                        return done(null, false, req.flash('loginMessage', 'No vendor found.'));
                    if (vendor.van_last_name != van_last_name){
                        // console.log(van_last_name)
                        // console.log(vendor.van_last_name)
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
                        // req.session.van_last_name = van_last_name;
                        // req.session.van_ID = van_ID;
                        req.session.van_last_name = van_last_name;
                        req.session.van_first_name = van_first_name; // for demonstration of using express-session
                        // done() is used by the strategy to set the authentication status with
                        // details of the vendor who was authenticated
                        // console.log("this vendor is authenticated")
                        // console.log(vendor)
                        return done(null, vendor, req.flash('loginMessage', 'Login successful'));
                    }
                });
            });
        }));
};

