const mongoose = require("mongoose")
var mongo = require('mongodb');
// import models
const Menu = mongoose.model("menu")
const Order = mongoose.model("orders")
const User = mongoose.model("users");

//returns detail of a user
const getOneUser = async (req, res) => {
    try {
        return res.send(await User.findOne({user_ID: req.params.user_ID}))
    } catch (err) {
        res.status(400)
        return res.send("Database query failed")
    }
}

// get all item records
const getAllItems = async (req, res) => {
    try {
        const menu_items = await Menu.find()
        return res.send(menu_items)
    } catch (err) {
        res.status(400)
        return res.send("Database query failed")
    }
}

//get all orders related to user
const getAllUserOrders = async (req, res) => {
    try {
        orders = await Order.find({user_ID: req.params.user_ID}).lean()
        return res.render('layouts/userOrders', {orders})
    } catch (err) {
        res.status(400)
        return res.send("Database query failed")
    }
}

// menu page
const displayMenu = async (req, res) => {
    try {
        const menu_items = await Menu.find()
        return res.send(menu_items)
    } catch (err) {
        res.status(400)
        return res.send("Database query failed")
    }
}


// get one food - user specifies its name
const getItemDetail = async (req, res) => {
    // console.log("Entered getItemDetail")
    item_name = (req.params.snack_name).toLowerCase()
    try {
        const menu_items = await Menu.find({item_name: item_name}, {})
        return res.send(menu_items)
    } catch (err) {
        res.status(400)
        return res.send("Database query failed")
    }
}

// make an order record and put it into the database
const orderItems = async (req, res) => {
    // console.log("Entered orderItems")
    try {
        var i;
        var calculatedTotalPayment = 0
        for (i=0; i<req.body.orderItems.length;i++) {
            var singlePrice = await (await Menu.findOne({item_name:req.body.orderItems[i].item_name.toLowerCase()},{})).item_price
            // console.log(singlePrice)
            calculatedTotalPayment = calculatedTotalPayment + req.body.orderItems[i].quantity * singlePrice
            // console.log(calculatedTotalPayment)
        }
        const newOrder = new Order({
            user_ID : req.params.user_ID,
            van_ID : req.body.van_ID,
            orderItems : req.body.orderItems,
            paymentTotal : calculatedTotalPayment
        })
        newOrder.save( (err, result) => {  // callback-style error-handler
            if (err) console.log(err)
            return res.send(result)
        })   
    } catch (err) {
        console.log(err)
    }
}

const getOrderDetail = async(req,res)=>{
    try{
        const order = await Order.findOne({_id: new mongoose.Types.ObjectId(req.params.order_ID)}).lean()
        res.render('layouts/orderDetail', {order})
    }catch(err){
        console.log(err)
    }
}

module.exports = {
    getAllItems,
    getAllUserOrders,
    displayMenu,
    getItemDetail,
    getOneUser,
    orderItems,
    getOrderDetail
}