const express = require('express')

// add our router 
const menuRouter = express.Router()

// require the customer controller
const menuController = require('../controllers/menuController.js')

// handle the GET request to get all authors
menuRouter.get('/', menuController.displayMenu)

// handle the GET request to get one author
menuRouter.get('/:name', menuController.getItemDetail)

// export the router
module.exports = menuRouter

