const express = require('express')

// add our router 
const menuRouter = express.Router()

// require the customer controller
const menuController = require('../controllers/menuController.js')
const { menu } = require('../models/menu.js')

// // handle the GET request to get all menu items
// non-hbs
// menuRouter.get('/menu', menuController.displayMenu)
//homepage
//menuRouter.get('/home', menuController.displayHome)
// handle the GET request to get all menu items from a certain van
menuRouter.get('/menu', menuController.displayMenu_hbs)
// handle the login 
menuRouter.get('/login', function (req, res) {
    return res.render('login');
});
menuRouter.post('/login', menuController.login)


// handle the register
menuRouter.get('/register', function (req, res) {
    res.render('register');
});
menuRouter.post('/register', menuController.register)

// handle the GET request to get one item
menuRouter.get('/menu/:snack_name', menuController.getItemDetail)

// handle the GET request to get one user
menuRouter.get('/:user_ID', menuController.getOneUser)

// handle the POST request for a new order
menuRouter.post('/:user_ID/order', menuController.postOrderItems);

// handle the GET request for all orders
menuRouter.get('/:user_ID/all-orders', menuController.getAllUserOrders)

menuRouter.get('/:user_ID/all-orders/:order_ID',menuController.getOrderDetail)

// menuRouter.get('/my-orders', menuController.loggedIn_MyOrders);
// menuRouter.get('/my-orders/:orderID', menuController.loggedIn_OrderDetails);


// export the router
module.exports = menuRouter

