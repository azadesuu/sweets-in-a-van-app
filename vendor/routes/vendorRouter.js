const express = require('express')

const vendorRouter = express.Router()

const vendorController = require('../controllers/vendorController.js')

vendorRouter.get('/',async(req, res)=>{
    res.render('index')
})

vendorRouter.get('/setVanStatus', (req,res)=>vendorController.setVanStatus(req,res))
//get one order
vendorRouter.get('/allOutstandingOrders',(req,res)=>vendorController.getAllOrders(req,res))

module.exports = vendorRouter
