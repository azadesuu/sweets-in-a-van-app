const mongoose = require("mongoose")
var mongo = require('mongodb');
// import models
const Menu = mongoose.model("menu")
const Order = mongoose.model("orders")
const User = mongoose.model("users");
const Vendor = mongoose.model("vendors");
const OrderItem = require("../models/order");
const bcrypt = require('bcrypt-nodejs');

const getHomePage = async(req, res) => {
    console.log("gethome");
    if (req.session.email) {
        var user = await User.findOne({email: req.session.email}, {}).lean();
    } else {
        var user = new User();
        user.latitude = 0;
        user.longitude = 0;
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
        return ((a.latitude-user.latitude)**2+(a.longitude-user.longitude)**2)-((b.latitude-user.latitude)**2+(b.longitude-user.longitude)**2)
    })
    vans = vans.slice(0,5);
    return res.render('customer/home', {req, "loggedin": req.isAuthenticated(), van: vans});
}


const postHomePage = async(req, res) => {
    console.log("posthome");
    if (req.body.latitude !== null) {
        if (req.session.email) {
            await User.updateOne(
                {"email" : req.session.email},
                {"$set" : { 
                    "latitude" : parseFloat(req.body.latitude),
                    "longitude" : parseFloat(req.body.longitude)
                    }
                }
            );
            console.log("After updating")
            var user = await User.findOne({email: req.session.email}, {}).lean();
            console.log(user.latitude);
            console.log(user.longitude);
        } else {
            var user = new User();
            user.latitude = parseFloat(req.body.latitude);
            user.longitude = parseFloat(req.body.longitude);
        }
    } else {
        if (req.session.email) {
            var user = await User.findOne({email: req.session.email}, {}).lean();
        } else {
            var user = new User();
            user.latitude = 0;
            user.longitude = 0;
        }
    }
    var vans = await Vendor.find({}, {}).lean();
    var i = 0;
    for (i=0;i<vans.length;i++) {
        if (vans[i].latitude === null) {
            vans.splice(i, 1)
        }
    }
    vans.sort(function(a,b) {
        return ((a.latitude-user.latitude)**2+(a.longitude-user.longitude)**2)-((b.latitude-user.latitude)**2+(b.longitude-user.longitude)**2)
    })
    vans = vans.slice(0,5);
    return res.render('customer/home', {req, "loggedin": req.isAuthenticated(), van: vans});
}


//  const displayMenu_hbs = async(req,res) => {
//     menu_items = await Menu.find().lean();
//     return res.render('customer/menu', {menu_items, "loggedin": req.isAuthenticated()});
//  }

 
//  const displayMenu_order = async(req,res) => {
//     menu_items = await Menu.find().lean();
//     return res.render('customer/menuOrdering', {menu_items, "loggedin": req.isAuthenticated()});
//  }





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

const payInVan = async (req, res) => {
    var cart = JSON.parse(req.body.cart);
    console.log(cart);
    var newOrders = [];
    for (var i = 0;i<cart.length;i++) {
        console.log(i)
        var hasItem = false
        var index = 0;
        var next = await Menu.findOne({item_ID : cart[i]}, {}).lean();
        for (var j=0;j<newOrders.length;j++) {
            // console.log(cart[i]);
            // this_name = await Menu.findOne({item_ID : cart[i]}, {}).lean().item_name;
            // console.log(this_name);
            console.log(newOrders[j].item_name);
            console.log(next.item_name);
            if (newOrders[j].item_name === next.item_name) {
                // newOrders[j].quantity += 1;
                // newOrders[j].price += await Menu.findOne({item_ID : cart[i]}, {}).lean().item_price;
                hasItem = true;
                index = j;
                break;
            } else {
                // console.log("Should create")
                // newOrderItem = {
                //     item_name : await Menu.findOne({item_ID : cart[i]}, {}).lean().item_name,
                //     quantity : 1,
                //     price : await Menu.findOne({item_ID : cart[i]}, {}).lean().item_price
                // }
                // console.log(newOrderItem);
                // newOrders.push(newOrderItem);
            }
        }
        if (hasItem) {
            newOrders[index].quantity += 1;
        } else {
            item = await Menu.findOne({item_ID : cart[i]}, {});
            console.log(item.item_name)
            newOrderItem = {
                item_name : item.item_name,
                quantity : 1,
                price : item.item_price
            }
            // console.log(newOrderItem);
            newOrders.push(newOrderItem);
        }
    }
    console.log(newOrders);
    return res.render('customer/payment');
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

// const showCart = async(req,res)=>{
//     try{
//         console.log(req.user)
//         const user = await User.findOne({user_ID:req.user })
//         console.log(user)
//         console.log(req.params.user_ID)
//         return res.render('customer/cart',{"user":user})
//     }catch(err){
//         console.log(err)
//     }
// }


module.exports = {
    getAllItems,
    getAllUserOrders,
    getHomePage,
    postHomePage,
    getItemDetail,
    getOneUser,
    getOrderDetail,
    myProfile,
    myProfileEdit,
    getVanDetail,
    getVanMenu,
    orderInVanMenu,
    payInVan
}