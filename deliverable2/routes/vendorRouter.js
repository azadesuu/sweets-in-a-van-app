const express = require('express')
const vendorRouter = express.Router()
const vendorController = require('../controllers/vendorController.js')

vendorRouter.get('/',async(req, res)=>{
    res.render('index')
})


vendorRouter.get('/:van_name',(req,res)=>vendorController.getOneVendor(req,res))
vendorRouter.put('/:van_name/status', (req,res)=>vendorController.showSetVanStatus(req,res))
vendorRouter.get('/:van_name/orders',(req,res)=>vendorController.getAllOutstandingOrders(req,res))
vendorRouter.get('/:van_name/orders/:order_id',(req,res)=>vendorController.getOneOrder(req,res))
vendorRouter.put('/:van_name/orders/:order_id/change-status',(req,res)=>vendorController.updateOrderStatus(req,res))
module.exports = vendorRouter
