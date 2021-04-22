const express = require('express')

// add our router 
const menuRouter = express.Router()

// require the customer controller
const menuController = require('../controllers/menuController.js')

// handle the GET request to get all menu items
menuRouter.get('/menu', menuController.displayMenu)

// handle the GET request to get one item
menuRouter.get('/menu/:name', menuController.getItemDetail)

// handle the POST request for a new order
menuRouter.post('/menu/:user_ID/order', menuController.orderItems)

// export the router
module.exports = menuRouter

