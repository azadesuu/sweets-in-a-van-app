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
    console.log(req.session)
    const vendor = await Vendor.findOne( {vanname: req.session.vanname}).lean()
    // console.log(vendor)
    return res.render('vendor/vendor-home',{"vendor":vendor,"loggedin":req.isAuthenticated()})
})

// handle the GET request to get one vendor
vendorRouter.get('/:van_ID',utilities.vendorIsLoggedIn,vendorController.getOneVendor)

vendorRouter.get('/:van_ID/setLocation', vendorController.showSetVanStatus)

// handle the PUT request to update one vendor's status
vendorRouter.put('/:van_ID/setLocation', vendorController.SetVanStatus)

// handle the GET request to get all of a vendor's orders
vendorRouter.get('/:van_ID/all-orders',utilities.vendorIsLoggedIn, vendorController.checkIsOpen,vendorController.getAllOrders)

// handle the GET request to get all of a vendor's outstanding orders
vendorRouter.get('/:van_ID/orders',utilities.vendorIsLoggedIn, vendorController.checkIsOpen,vendorController.getAllOutstandingOrders)

// handle the GET request to get one order of a vendor
vendorRouter.get('/:van_ID/orders/:order_id',utilities.vendorIsLoggedIn, vendorController.checkIsOpen,vendorController.getOneOrder)

// handle the PUT request to update one vendor's order status (flexible)
vendorRouter.put('/:van_ID/orders/:order_id/change-status',utilities.vendorIsLoggedIn, vendorController.checkIsOpen,vendorController.updateOrderStatus)

// handle the PUT request to update one vendor's order status to fulfilled
vendorRouter.put('/:van_ID/orders/:order_id/fulfilled',utilities.vendorIsLoggedIn, vendorController.checkIsOpen,vendorController.markAsFulfilled)

// handle the PUT request to update one vendor's order status to complete
vendorRouter.put('/:van_ID/orders/:order_id/complete',utilities.vendorIsLoggedIn, vendorController.checkIsOpen,vendorController.markAsComplete)

module.exports = vendorRouter