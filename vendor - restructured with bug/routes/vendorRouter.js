const express = require('express')

const vendorRouter = express.Router()

const vendorController = require('../controllers/vendorController.js')

vendorRouter.get('/allOutstandingOrders', vendorController.getAllOrders)

module.exports = vendorRouter
