const express = require('express')
const utilities = require("./utility");
// add our router 
const menuRouter = express.Router()
const passport = require('passport');
require('../config/passport')(passport);

// require the customer controller
const menuController = require('../controllers/menuController.js')

//authentication

//homepage
menuRouter.get("/home-2", utilities.isLoggedIn, (req, res) => {
    return res.render('customer/customer-home', {req, "loggedin": req.isAuthenticated()});
 })

// handle the GET request to get all menu items from a certain van
menuRouter.get('/menu', menuController.displayMenu_hbs, {"loggedin": req.isAuthenticated()})


menuRouter.get("/login", (req, res) => {
    res.render('customer/login');
});

// POST login form -- authenticate user
// http:localhost:5000/customer/login
menuRouter.post('/login', passport.authenticate('local-login', {
    successRedirect : '/', // redirect to the homepage
    failureRedirect : '/customer/login', // redirect back to the login page if there is an error
    failureFlash : true // allow flash messages
}));


// GET - show the signup form to the user
// http:localhost:5000/customer/register
menuRouter.get("/register", (req, res) => {
    return res.render('customer/register');
});

// POST - user submits the signup form -- signup a new user
// http:localhost:5000/customer/register
menuRouter.post('/register', passport.authenticate('local-signup', {
    successRedirect : '/', // redirect to the homepage
    failureRedirect : '/customer/register', // redirect to signup page
    failureFlash : true // allow flash messages
}));

// LOGOUT
menuRouter.post('/logout', function(req, res) {
    // save the favourites
    req.logout();
    req.flash('');
    res.redirect('/customer/');
});
//authentication END

//
//menuRouter.get('/:user_ID', menuController.getOneUser)
menuRouter.get('/my-orders', utilities.isLoggedIn, menuController.getAllUserOrders);

menuRouter.get('/my-orders/:order_ID', utilities.isLoggedIn, menuController.getOrderDetail);

// export the router
module.exports = menuRouter

