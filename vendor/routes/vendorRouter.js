const express = require('express')
const vendorRouter = express.Router()
const vendorController = require('../controllers/vendorController.js')

vendorRouter.get('/',async(req, res)=>{
    res.render('index')
})
vendorRouter.get('/vendors/:id',(req,res)=>vendorController.getOneVendor(req,res))
vendorRouter.get('/orders/:id',(req,res)=>vendorController.showOrder(req,res))
vendorRouter.post('/orders/:id',(req,res)=>vendorController.markOrderAsReady(req,res))
vendorRouter.get('/vendors/:id/setVanStatus', (req,res)=>vendorController.showSetVanStatus(req,res))
vendorRouter.post('/vendors/:id/setVanStatus', (req,res)=>vendorController.submitAndBack(req,res))
vendorRouter.get('/vendors/:id/allOutstandingOrders',(req,res)=>vendorController.getAllOrders(req,res))
vendorRouter.post('/search', (req,res)=> vendorController.searchVendorID(req,res))
module.exports = vendorRouter
