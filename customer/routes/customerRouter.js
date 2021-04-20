const express = require('express')

// add our router 
const customerRouter = express.Router()

// require the customer controller
const customerController = require('../controllers/customerController.js')

// handle the GET request to get all authors
customerRouter.get('/', customerController.displayMenu)

// export the router
module.exports = customerRouter

