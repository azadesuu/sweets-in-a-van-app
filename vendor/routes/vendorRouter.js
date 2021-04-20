const express = require('express')
const vendorRouter = express.Router()
const expressValidator = require('express-validator')

const vendorController = require('../controllers/vendorController.js')

vendorRouter.get('/',async(req, res)=>{
    res.render('index')
})
vendorRouter.get('vendor/:id',(req,res)=>vendorController.getOneVendor(req,res))
vendorRouter.get('orders/:id',(req,res)=>vendorController.markOrderAsReady(req,res))
vendorRouter.get('/setVanStatus', (req,res)=>vendorController.setVanStatus(req,res))
vendorRouter.get('/allOutstandingOrders',(req,res)=>vendorController.getAllOrders(req,res))
vendorRouter.post('/search', expressValidator.body('van_ID'), (res,req)=> vendorController.searchVendorID(req,res))
module.exports = vendorRouter
