const express = require('express')

const vendorRouter = express.Router()

const vendorController = require('../controllers/vendorController.js')

vendorRouter.get('/',async(req, res)=>{
    res.render('index')
})

//vendorRouter.get('/allOutstandingOrders', vendorController.getAllOrders(req,res))

vendorRouter.get('/setLocation', async(req, res)=>{
    res.render('serVanLocation')
})

module.exports = vendorRouter
