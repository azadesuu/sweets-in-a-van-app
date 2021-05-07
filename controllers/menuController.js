const mongoose = require("mongoose")
var mongo = require('mongodb');
// import models
const Menu = mongoose.model("menu")
const Order = mongoose.model("orders")
const User = mongoose.model("users");

const displayHome = async(req,res) => {
    var user_firstname = req.user.first_name;
    console.log(req.user);
    return res.render('customer/customer-home', {"user_first_name" : user_firstname, "loggedin": req.isAuthenticated()});
}

 const displayMenu_hbs = async(req,res) => {
    menu_items = await Menu.find().lean();
    return res.render('customer/menu', {menu_items, "loggedin": req.isAuthenticated()});
 }

 
 const displayMenu_order = async(req,res) => {
    menu_items = await Menu.find().lean();
    return res.render('customer/menuOrdering', {menu_items, "loggedin": req.isAuthenticated()});
 }

//returns detail of a user
const getOneUser = async (req, res) => {
    try {
        return res.send(await User.findOne({_id: new mongoose.Types.ObjectId(req.body.user_id)}))
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
        orders = await Order.find({_id: req.body.user_id}).lean()
        return res.render('customer/userOrders', {orders})
    } catch (err) {
        res.status(400)
        return res.send("Database query failed")
    }
}

// get one food - user specifies its name
const getItemDetail = async (req, res) => {
    item_name = (req.params.snack_name).toLowerCase()
    try {
        const menu_items = await Menu.find({item_name: item_name}, {})
        return res.send(menu_items)
    } catch (err) {
        res.status(400)
        return res.send("Database query failed")
    }
}

const getOrderDetail = async(req,res)=>{
    try{
        const order = await Order.findOne( {_id: new mongoose.Types.ObjectId(req.params.order_ID)}).lean()
        return res.render('customer/orderDetail', {order})
    }catch(err){
        console.log(err)
    }
}



module.exports = {
    getAllItems,
    getAllUserOrders,
    displayHome,
    displayMenu_hbs,
    displayMenu_order,
    getItemDetail,
    getOneUser,
    getOrderDetail
}