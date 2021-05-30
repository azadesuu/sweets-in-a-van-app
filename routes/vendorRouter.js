const express = require('express')
const utilities = require("./utility")

const vendorRouter = express.Router()
const passport = require('passport');
require('../config/vendorPassport')(passport);

const mongoose = require("mongoose")
const Vendor = mongoose.model("vendors")


const vendorController = require('../controllers/vendorController.js');
vendorRouter.get("/login", (req, res) => {
    res.render('vendor/login');
});

// POST login form -- authenticate user
// http:localhost:5000/vendor/login
vendorRouter.post('/login', passport.authenticate('local-login-vendor', {
    successRedirect : '/vendor', // redirect to the home
    failureRedirect : '/vendor/login', // redirect back to the login page if there is an error
    failureFlash : true // allow flash messages
}));


vendorRouter.get("/",async(req,res)=>{
    const vendor = await Vendor.findOne( {van_first_name: req.session.van_first_name}).lean()
    return res.render('vendor/vendor-home',{"vendor":vendor,"loggedin":req.isAuthenticated()})
})

vendorRouter.post('/logout', function(req, res) {
    req.logout();
    req.flash('');
    res.redirect('/');
});

vendorRouter.get('/:van_ID/setLocation',utilities.vendorIsLoggedIn, vendorController.showSetVanStatus)

// handle the PUT request to update one vendor's status
vendorRouter.post('/:van_ID/setLocation',utilities.vendorIsLoggedIn, vendorController.SetVanStatus)

vendorRouter.post('/:van_ID/setLocation/leave', utilities.vendorIsLoggedIn,vendorController.markLeavingLocation)

vendorRouter.post('/:van_ID/orders/search', utilities.vendorIsLoggedIn,vendorController.searchOrder)

// handle the GET request to get all of a vendor's orders
vendorRouter.get('/:van_ID/all-orders',utilities.vendorIsLoggedIn,vendorController.getAllOrders)

// handle the GET request to get all of a vendor's outstanding orders
vendorRouter.get('/:van_ID/orders',utilities.vendorIsLoggedIn, vendorController.checkIsOpen,vendorController.getAllOutstandingOrders)

// handle the GET request to get one order of a vendor
vendorRouter.get('/:van_ID/orders/:order_ID',utilities.vendorIsLoggedIn,vendorController.getOneOrder)

// handle the PUT request to update one vendor's order status to fulfilled
vendorRouter.post('/:van_ID/orders/:order_ID/fulfilled',utilities.vendorIsLoggedIn,vendorController.markAsFulfilled)

// handle the PUT request to update one vendor's order status to complete
vendorRouter.post('/:van_ID/orders/:order_ID/complete',utilities.vendorIsLoggedIn,vendorController.markAsComplete)

module.exports = vendorRouter