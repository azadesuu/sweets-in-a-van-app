const express = require('express')
const utilities = require("./utility");
// add our router 
const menuRouter = express.Router()
const passport = require('passport');
require('../config/userPassport')(passport);

// require the customer controller
const menuController = require('../controllers/menuController.js')

//authentication

//homepage
menuRouter.get("/home", menuController.homePage);

// // handle the GET request to get all menu items from a certain van
// menuRouter.get('/menu', menuController.displayMenu_hbs)

menuRouter.get("/login", (req, res) => {
    res.render('customer/login');
});

// POST login form -- authenticate user
// http:localhost:5000/customer/login
menuRouter.post('/login', passport.authenticate('local-login', {
    successRedirect : '/customer/home', // redirect to the homepage
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
    successRedirect : '/customer/home', // redirect to the homepage
    failureRedirect : '/customer/register', // redirect to signup page
    failureFlash : true // allow flash messages
}));

// LOGOUT
menuRouter.get('/logout', function(req, res) {
    // save the favourites
    req.logout();
    req.flash('');
    res.redirect('/customer/home');
});
//authentication END

//
//menuRouter.get('/:user_ID', menuController.getOneUser)

menuRouter.get('/my-profile', menuController.myProfile);
menuRouter.get('/my-profile/edit', (req, res) => {
    return res.render('customer/myProfileEdit');
});
menuRouter.post('/my-profile/edit', menuController.myProfileEdit);
menuRouter.get('/my-orders', menuController.getAllUserOrders);
menuRouter.get('/my-orders/:order_ID', menuController.getOrderDetail);
menuRouter.get('/my-orders/:order_ID/rate');
menuRouter.get('/:van_id', menuController.getVanDetail);
menuRouter.get('/:van_id/menu', menuController.getVanMenu);
menuRouter.get('/:van_id/menu/order');
menuRouter.get('/:van_id/menu/order/cart');
menuRouter.get('/:van_id/menu/order/payment');

// menuRouter.get('/:user_id/my-orders', utilities.customerIsLoggedIn, menuController.getAllUserOrders);

// menuRouter.get('/:user_id/my-orders/:order_ID', utilities.customerIsLoggedIn, menuController.getOrderDetail);

// menuRouter.get('/:van_id/order-now', utilities.customerIsLoggedIn, menuController.displayMenu_order);
// menuRouter.get('/:van_id/order-now/cart', utilities.customerIsLoggedIn, menuController.showCart);


// export the router    
module.exports = menuRouter

