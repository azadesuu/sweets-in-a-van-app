const mongoose = require("mongoose")

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
        orders = await Order.find({user_ID: req.params.user_ID})
        return res.render('userOrders')
    } catch (err) {
        res.status(400)
        return res.send("Database query failed")
    }
}

// menu page
const displayMenu = async (req, res) => {
    try {
        const menu_items = await Menu.find({}, {_id: false, item_name: true, item_price: true, item_photo: true})
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

const getOrderDetail = async(res,req)=>{
    try{
        const order = await Order.findOne({order_ID:req.params.order_ID},{order_ID = true, when = true, paymentTotal = true})
        res.render('orderDetail', order)
    }catch(err){
        console(err)
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