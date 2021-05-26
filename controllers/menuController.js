const mongoose = require("mongoose")
var mongo = require('mongodb');
// import models
const Menu = mongoose.model("menu")
const Order = mongoose.model("orders")
const User = mongoose.model("users");
const Vendor = mongoose.model("vendors");

const bcrypt = require('bcrypt-nodejs');

const postHomePage = async(req, res) => {
    if (req.session.email) {
        var user = await User.findOne({email: req.session.email}, {}).lean();
    } else {
        var user = new User();
        user.latitude = req.body.latitude;
        user.longtitude = req.body.longtitude;
        // user.latitude = 0;
        // user.longtitude = 0;
    }
    var vans = await Vendor.find({}, {}).lean();
    var i = 0;
    var index = 0;
    for (i=0;i<vans.length;i++) {
        if (vans[i].latitude === null) {
            vans.splice(i, 1)
        }
    }
    vans.sort(function(a,b) {
        return ((a.latitude-user.latitude)**2+(a.longtitude-user.longtitude)**2)-((b.latitude-user.latitude)**2+(b.longtitude-user.longtitude)**2)
    })
    vans = vans.slice(0,5);
    return res.render('customer/home', {req, "loggedin": req.isAuthenticated(), van: vans});
}


 const displayMenu_hbs = async(req,res) => {
    menu_items = await Menu.find().lean();
    return res.render('customer/menu', {menu_items, "loggedin": req.isAuthenticated()});
 }

 
 const displayMenu_order = async(req,res) => {
    menu_items = await Menu.find().lean();
    return res.render('customer/menuOrdering', {menu_items, "loggedin": req.isAuthenticated()});
 }





const myProfile = async (req, res) => {
    var name = await User.findOne({email: req.session.email}, {_id:false, first_name: true, last_name: true});
    return res.render('customer/myProfile', {"email":req.session.email, "first_name":name.first_name, "last_name":name.last_name});
}

const myProfileEdit = async (req, res) => {
    await User.updateOne(
        {"email" : req.session.email},
        {"$set" : { 
            "first_name" : req.body.first_name,
            "last_name" : req.body.last_name,
            "password" : bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
            }
        }
    );
    return res.render('customer/home');
}

const myOrderRate = async (req, res) => {
    return res.render('customer/myProfile');
}

const getVanDetail = async (req, res) => {
    var van = await Vendor.findOne({van_ID : req.params.van_id}, {}).lean();
    return res.render('customer/van', {van});
}

const getVanMenu = async (req, res) => {
    var van = await Vendor.findOne({van_ID : req.params.van_id}, {}).lean();
    menu_items = await Menu.find().lean();
    return res.render('customer/menu', {van, menu_items, "loggedin": req.isAuthenticated()});
}

const orderInVanMenu = async (req, res) => {
    menu_items = await Menu.find().lean();
    return res.render('customer/menuOrdering', {van_id: req.params.van_id, menu_items, "loggedin": req.isAuthenticated()});
}

const getVanCart = async (req, res) => {
    return res.render('customer/cart');
}

const payInVan = async (req, res) => {
    return res.render('customer/myProfile');
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
        user = await User.findOne({email: req.session.email}, {}).lean()
        orders = await Order.find({user_ID: user.user_ID}, {}).lean()
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

const showCart = async(req,res)=>{
    try{
        console.log(req.user)
        const user = await User.findOne({user_ID:req.user })
        console.log(user)
        console.log(req.params.user_ID)
        return res.render('customer/cart',{"user":user})
    }catch(err){
        console.log(err)
    }
}


module.exports = {
    getAllItems,
    getAllUserOrders,
    postHomePage,
    displayMenu_hbs,
    displayMenu_order,
    getItemDetail,
    getOneUser,
    getOrderDetail,
    showCart,
    myProfile,
    myProfileEdit,
    getVanDetail,
    getVanMenu,
    orderInVanMenu,
    getVanCart
}