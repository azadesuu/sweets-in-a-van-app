// Used code from week 9's demo, made changes according to specs

const { nanoid } = require('nanoid'); // for hashing user id
const LocalStrategy = require('passport-local').Strategy;

// our user model
const { User } = require('../models/user');
const { Vendor } = require('../models/vendor');

module.exports = function(passport) {
    // these two functions are used by passport to store information
    // in and retrieve data from sessions. We are using user's object id
    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    passport.deserializeUser(function(user, done) {
        if(user.user_ID){
            User.findById(user._id, function(err, user) {
                done(err, user);
            });
        }else{
            Vendor.findById(user._id,function(err, user) {
                done(err, user);
            })
        }
    });


    // strategy to login
    // this method only takes in username and password, and the field names
    // should match of those in the login form
    passport.use('local-login', new LocalStrategy({
            usernameField : 'email',
            passwordField : 'password',
            passReqToCallback : true}, // pass the req as the first arg to the callback for verification
        function(req, email, password, done) {
            // you can read more about the nextTick() function here:
            // https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/
            // we are using it because without it the User.findOne does not work,
            // so it's part of the 'syntax'
            process.nextTick(function() {
                // see if the user with the email exists
                User.findOne({ 'email' :  email }, function(err, user) {
                    // if there are errors, user is not found or password
                    // does match, send back errors
                    if (err)
                        return done(err);
                    if (!user)
                        return done(null, false, req.flash('loginMessage', 'No user found.'));

                    if (!user.validPassword(password)){
                        // console.log(req.body)
                        // false in done() indicates to the strategy that authentication has
                        // failed
                        return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
                    }
                    // otherwise, we put the user's email in the session
                    else {
                        // in app.js, we have indicated that we will be using sessions
                        // the server uses the included modules to create and manage
                        // sessions. each client gets assigned a unique identifier and the
                        // server uses that identifier to identify different clients
                        // all this is handled by the session middleware that we are using
                        req.session.email = email; // for demonstration of using express-session
                        // done() is used by the strategy to set the authentication status with
                        // details of the user who was authenticated
                        return done(null, user, req.flash('loginMessage', 'Login successful'));
                    }
                });
            });

        }));



    // for signup
    passport.use('local-signup', new LocalStrategy({
            usernameField : 'email',
            passwordField : 'password',
            passReqToCallback : true }, // pass the req as the first arg to the callback for verification

         function(req, email, password, done) {
            process.nextTick( function() {
                User.findOne({'email': email}, function(err, existingUser) {
                    // search a user by the username (email in our case)
                    // if user is not found or exists, exit with false indicating
                    // authentication failure
                    if (err) {
                        console.log(err);
                        return done(err);
                    }
                    if (existingUser) {
                        return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
                    }
                    // Password length checking
                    if (password.length < 8) {
                        return done(null, false, req.flash('signupMessage', 'Password too short'));
                    }
                    // Password contains at least one digit checking
                    if (! /\d/.test(password)) {
                        return done(null, false, req.flash('signupMessage', 'No digit'));
                    }
                    // Password contains at least one letter checking
                    if (! /[a-zA-Z]/.test(password)) {
                        return done(null, false, req.flash('signupMessage', 'No alpha'));
                    }
                    else {
                        var newUser = new User();
                        newUser.user_ID = nanoid();
                        newUser.email = email;
                        newUser.password = newUser.generateHash(password);
                        newUser.first_name = req.body.first_name;
                        newUser.last_name = req.body.last_name;
                        newUser.latitude = 0;
                        newUser.longitude = 0;

                        // and save the user
                        newUser.save(function(err) {
                            if (err)
                                throw err;

                            return done(null, newUser);
                        });

                        // put the user's email in the session so that it can now be used for all
                        // communications between the client (browser) and the FoodBuddy app
                        req.session.email=email;
                    }
                });
            });
        }));

};

