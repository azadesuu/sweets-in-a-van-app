const mongoose = require("mongoose")
var mongo = require('mongodb');
// import models
const Menu = mongoose.model("menu")
const Order = mongoose.model("orders")
const User = mongoose.model("users");
const Vendor = mongoose.model("vendors");
const OrderItem = require("../models/order");
const bcrypt = require('bcrypt-nodejs');
const { nanoid } = require('nanoid'); // for hashing id

const getHomePage = async(req, res) => {
    // console.log("gethome");
    if (req.session.email) {
        var user = await User.findOne({email: req.session.email}, {}).lean();
    } else {
        var user = new User();
        user.latitude = 0;
        user.longitude = 0;
    }
    var vans = await Vendor.find({isOpen : true}, {}).lean();
    var i = 0;
    for (i=0;i<vans.length;i++) {
        if (vans[i].latitude === null) {
            vans.splice(i, 1);
            i--;
        } 
    }
    vans.sort(function(a,b) {
        return ((a.latitude-user.latitude)**2+(a.longitude-user.longitude)**2)-((b.latitude-user.latitude)**2+(b.longitude-user.longitude)**2)
    })
    if (vans.length > 5) {
        vans = vans.slice(0,5);
    }
    return res.render('customer/home', {req, "loggedin": req.isAuthenticated(), van: vans, layout:'customer_main'});
}


const postHomePage = async(req, res) => {
    // console.log("posthome");
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
    var vans = await Vendor.find({isOpen : true}, {}).lean();
    var i = 0;
    for (i=0;i<vans.length;i++) {
        if (vans[i].latitude === null) {
            vans.splice(i, 1);
            i--;
        } 
    }
    vans.sort(function(a,b) {
        return ((a.latitude-user.latitude)**2+(a.longitude-user.longitude)**2)-((b.latitude-user.latitude)**2+(b.longitude-user.longitude)**2)
    })
    if (vans.length > 5) {
        vans = vans.slice(0,5);
    }
    return res.render('customer/home', {req, "loggedin": req.isAuthenticated(), van: vans, layout:'customer_main'});
}






const myProfile = async (req, res) => {
    if (!req.isAuthenticated()) {
        res.redirect('/customer/login');
    } else {
        var name = await User.findOne({email: req.session.email}, {_id:false, first_name: true, last_name: true});
        return res.render('customer/myProfile', {"email":req.session.email, "first_name":name.first_name, "last_name":name.last_name, layout:'customer_main', "loggedin": req.isAuthenticated()});
    }
}

const myProfileEdit = async (req, res) => {
    if (req.body.first_name) {
        await User.updateOne(
            {"email" : req.session.email},
            {"$set" : { 
                "first_name" : req.body.first_name,
                "last_name" : req.body.last_name,
                "password" : bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
                }
            }
        );
    }
    return res.render('customer/home', {layout:'customer_main', "loggedin": req.isAuthenticated()});
}

const getVanDetail = async (req, res) => {
    var van = await Vendor.findOne({van_ID : req.params.van_id}, {}).lean();
    return res.render('customer/van', {layout:'customer_main', "loggedin": req.isAuthenticated(), van});
}

const getVanMenu = async (req, res) => {
    var van = await Vendor.findOne({van_ID : req.params.van_id}, {}).lean();
    menu_items = await Menu.find().lean();
    return res.render('customer/menu', {layout:'customer_main', "loggedin": req.isAuthenticated(), van, menu_items});
}

const orderInVanMenu = async (req, res) => {
    if (!req.isAuthenticated()) {
        res.redirect('/customer/login');
    } else {
    menu_items = await Menu.find().lean();
    return res.render('customer/menuOrdering', {layout:'customer_main', "loggedin": req.isAuthenticated(), van_id: req.params.van_id, menu_items});
    }
}

const payInVan = async (req, res) => {
    if (!req.isAuthenticated()) {
        res.redirect('/customer/login');
    } else {
        var cart = JSON.parse(req.body.cart);
        // console.log(cart);
        var newOrders = [];
        var totalPay = 0;
        for (var i = 0;i<cart.length;i++) {
            // console.log(i)
            var hasItem = false
            var index = 0;
            var next = await Menu.findOne({item_ID : cart[i]}, {}).lean();
            for (var j=0;j<newOrders.length;j++) {
                if (newOrders[j].item_name === next.item_name) {
                    hasItem = true;
                    index = j;
                    break;
                } 
            }
            if (hasItem) {
                newOrders[index].quantity += 1;
                totalPay += next.item_price;
            } else {
                item = await Menu.findOne({item_ID : cart[i]}, {});
                newOrderItem = {
                    item_name : item.item_name,
                    quantity : 1,
                    price : item.item_price
                }
                totalPay += item.item_price;
                newOrders.push(newOrderItem);
            }
        }
        var newOrder = new Order();
        var orderingCustomer = await User.findOne({email: req.session.email}, {})
        newOrder.user_ID = orderingCustomer.user_ID
        newOrder.van_ID = req.params.van_id;
        newOrder.order_ID = nanoid();
        newOrder.orderItems = newOrders;
        newOrder.customerGivenName = orderingCustomer.first_name;
        newOrder.paymentTotal = totalPay;
        newOrder.save();
        return res.render('customer/payment', {layout:'customer_main', "loggedin": req.isAuthenticated()});
    }
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

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();
    if (month.length < 2) {
        month = '0' + month;
    }
    if (day.length < 2) {
        day = '0' + day;
    }
    return [day, month, year].join('/');
}

//get all orders related to user
const getAllUserOrders = async (req, res) => {
    if (!req.isAuthenticated()) {
        res.redirect('/customer/login');
    } else {
        try {
            user = await User.findOne({email: req.session.email}, {}).lean()
            ordersRaw = await Order.find({user_ID: user.user_ID}, {_id: false, order_ID: true, when: true, status: true}).lean()
            // console.log(ordersRaw);
            for (var i=0;i<ordersRaw.length;i++) {
                if (ordersRaw[i].status === "Cancelled") {
                    ordersRaw.splice(i, 1);
                    i--;
                }
            }
            ordersRaw.sort(function(a,b) {
                return (b.when.getTime() - a.when.getTime());
            });
            var orders = [];
            for (var i=0;i<ordersRaw.length;i++) {
                orders[i] = {
                    order_ID : ordersRaw[i].order_ID,
                    when : formatDate(ordersRaw[i].when)
                }
            }
            return res.render('customer/userOrders', {orders, layout:'customer_main', "loggedin": req.isAuthenticated()})
        } catch (err) {
            res.status(400)
            return res.send("Database query failed")
        }
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
    if (!req.isAuthenticated()) {
        res.redirect('/customer/login');
    } else{
        try{
            const order = await Order.findOne( {order_ID: req.params.order_ID}).lean()
            const van = await Vendor.findOne( {van_ID: order.van_ID}).lean()
            var timeCreated = order.when;
            timeCreated = timeCreated.getTime() / 1000;
            var timeRemaining = 900 - (Date.now()/1000 - timeCreated);
            var hasTimeLeft = false;
            if (timeRemaining > 0) {
                hasTimeLeft = true;
            }
            return res.render('customer/orderDetail', {layout:'customer_main', "loggedin": req.isAuthenticated(), order, van, timeRemaining, hasTimeLeft})
        }catch(err){
            console.log(err)
        }
    }
}

const cancelOrder = async(req, res)=> {
    // console.log(req.body.cancelID);
    if (req.body.status) {
        await Order.updateOne(
            {"order_ID" : req.body.cancelID},
            {"$set" : { 
                "status" : "Cancelled"
                }
            }
        );
    }
    return res.redirect('/customer/my-orders', {layout:'customer_main', "loggedin": req.isAuthenticated()});
}
const changeOrder = async(req, res)=> {
    if (!req.isAuthenticated()) {
        res.redirect('/customer/login');
    } else {
        menu_items = await Menu.find().lean();
        const order = await Order.findOne( {order_ID: req.body.changeID}).lean();
        return res.render('customer/orderChange', {layout:'customer_main', "loggedin": req.isAuthenticated(), menu_items, order});
    }
}

const updateOrder = async(req, res)=> {
    if (!req.isAuthenticated()) {
        res.redirect('/customer/login');
    } else {
        var cart = JSON.parse(req.body.cart);
        // console.log(cart);
        var newOrders = [];
        var totalPay = 0;
        for (var i = 0;i<cart.length;i++) {
            // console.log(i)
            var hasItem = false
            var index = 0;
            var next = await Menu.findOne({item_ID : cart[i]}, {}).lean();
            for (var j=0;j<newOrders.length;j++) {
                if (newOrders[j].item_name === next.item_name) {
                    hasItem = true;
                    index = j;
                    break;
                } 
            }
            if (hasItem) {
                newOrders[index].quantity += 1;
                totalPay += next.item_price;
            } else {
                item = await Menu.findOne({item_ID : cart[i]}, {});
                newOrderItem = {
                    item_name : item.item_name,
                    quantity : 1,
                    price : item.item_price
                }
                totalPay += item.item_price;
                newOrders.push(newOrderItem);
            }
        }
        // console.log(req.body.updateID)
        
        await Order.updateOne(
            {"order_ID" : req.body.updateID},
            {"$set" : { 
                "orderItems" : newOrders,
                "paymentTotal" : totalPay,
                "when" : Date.now
                }
            }
        );
        return res.redirect('/customer/home', {layout:'customer_main', "loggedin": req.isAuthenticated()});
    }
}


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
    payInVan,
    cancelOrder,
    changeOrder,
    updateOrder
}