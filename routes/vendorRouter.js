const express = require('express')
const vendorRouter = express.Router()
const vendorController = require('../controllers/vendorController.js')

vendorRouter.get('/',async(req, res)=>{
    res.render('index')
})


// handle the GET request to get one vendor
vendorRouter.get('/:van_ID',(req,res)=>vendorController.getOneVendor(req,res))

// handle the PUT request to update one vendor's status
vendorRouter.put('/:van_ID/status', (req,res)=>vendorController.showSetVanStatus(req,res))

// handle the GET request to get all of a vendor's orders
vendorRouter.get('/:van_ID/all-orders',(req,res)=>vendorController.getAllOrders(req,res))

// handle the GET request to get all of a vendor's outstanding orders
vendorRouter.get('/:van_ID/orders',(req,res)=>vendorController.getAllOutstandingOrders(req,res))

// handle the GET request to get one order of a vendor
vendorRouter.get('/:van_ID/orders/:order_id',(req,res)=>vendorController.getOneOrder(req,res))

// handle the PUT request to update one vendor's order status
vendorRouter.put('/:van_ID/orders/:order_id/change-status',(req,res)=>vendorController.updateOrderStatus(req,res))
module.exports = vendorRouter
