// Used code from week 9's demo, made changes according to specs
const express = require('express')
// add our router 
const menuRouter = express.Router()
const passport = require('passport');
require('../config/userPassport')(passport);

// require the customer controller
const menuController = require('../controllers/menuController.js')


//homepage with GET
menuRouter.get("/home", menuController.getHomePage);
//homepage with POST, req.body has user's location info if user agrees to share location
menuRouter.post("/home", menuController.postHomePage);

//authentication START
/**
 * Log in page
 * Only can be accessed if user hasn't logged in
 * Will redirect to homepage if user has logged in
 */
menuRouter.get("/login", (req, res) => {
    if (req.isAuthenticated()) {
        res.redirect('/customer/home', {layout:'customer_main'});
    } else {
        res.render('customer/login', {layout:'customer_main'});
    }
});

menuRouter.post('/login', passport.authenticate('local-login', {
    successRedirect : '/customer/home', // redirect to the homepage
    failureRedirect : '/customer/login', // redirect back to the login page if there is an error
    failureFlash : true // allow flash messages
}));

/**
 * Register page
 * Only can be accessed if user hasn't logged in
 * Will redirect to homepage if user has logged in
 */
menuRouter.get("/register", (req, res) => {
    if (req.isAuthenticated()) {
        res.redirect('/customer/home', {layout:'customer_main'});
    } else {
        return res.render('customer/register', {layout:'customer_main'});
    }
});

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

/**
 * My profile page
 * Display logged in user's email, name
 * Will redirect to homepage if not logged in
 */
menuRouter.get('/my-profile', menuController.myProfile);

/**
 * Edit profile page
 * Allows user to enter their new names and passwords
 * Will redirect to homepage if not logged in
 */
menuRouter.get('/my-profile/edit', (req, res) => {
    if (!req.isAuthenticated()) {
        res.redirect('/customer/login');
    } else {
        return res.render('customer/myProfileEdit', {layout:'customer_main', "loggedin": req.isAuthenticated()});
    }
});
menuRouter.post('/my-profile/edit', menuController.myProfileEdit);

/**
 * View orders page
 * Display a list of placed orders
 * Will redirect to homepage if not logged in
 */
menuRouter.get('/my-orders', menuController.getAllUserOrders);

/**
 * Order detail page
 * Display the time, items and payment info of specific order
 * Will redirect to homepage if not logged in
 */
menuRouter.get('/my-orders/:order_ID', menuController.getOrderDetail);

/**
 * Update orders pages
 * Handles the cancel/change users want to their orders
 * Will redirect to homepage if not logged in
 */
menuRouter.post('/my-orders/cancel', menuController.cancelOrder);
menuRouter.post('/my-orders/change', menuController.changeOrder);
menuRouter.post('/my-orders/update', menuController.updateOrder);

/**
 * Van detail page
 * Display van's id and van's name and the option to view its menu
 */
menuRouter.get('/van/:van_id', menuController.getVanDetail);

/**
 * Menu page
 * Allow users to view menu even if they haven't logged in
 */
menuRouter.get('/van/:van_id/menu', menuController.getVanMenu);

/**
 * Ordering in menu page
 * Allow users to select and enter quantity of menu items and make order
 * Will redirect to homepage if not logged in
 */
menuRouter.get('/van/:van_id/menu/order', menuController.orderInVanMenu);

/**
 * Payment page
 * Save the order into database and display payment page, which is 
 * empty right now but ready for implementing external payment system
 * Will redirect to homepage if not logged in
 */
menuRouter.post('/van/:van_id/menu/order/payment', menuController.payInVan);

module.exports = menuRouter

