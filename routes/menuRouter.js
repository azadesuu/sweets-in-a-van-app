const express = require('express')

// add our router 
const menuRouter = express.Router()

// require the customer controller
const menuController = require('../controllers/menuController.js')

// handle the GET request to get all menu items
menuRouter.get('/menu', menuController.displayMenu)

// handle the GET request to get one item
menuRouter.get('/menu/:snack_name', menuController.getItemDetail)

// handle the GET request to get one user
menuRouter.get('/:user_ID', menuController.getOneUser)

// handle the POST request for a new order
menuRouter.post('/:user_ID/order', menuController.orderItems)

// handle the GET request for all orders
menuRouter.get('/:user_ID/all-orders', menuController.getAllUserOrders)

// export the router
module.exports = menuRouter

