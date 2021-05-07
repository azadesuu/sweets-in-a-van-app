const mongoose = require("mongoose")
var mongo = require('mongodb');
// import models
const Menu = mongoose.model("menu")
const Order = mongoose.model("orders")
const User = mongoose.model("users");

const displayHome = async(req,res) => {
    return res.render('layouts/customer/customer-home', {req});
 }

//returns detail of a user
const getOneUser = async (req, res) => {
    try {
        return res.send(await User.findOne({_id: req.params.user_id}))
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
        orders = await Order.find({_id: req.params.user_id}).lean()
        return res.render('layouts/customer/userOrders', {orders})
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
 
const displayMenu_hbs = async (req, res) => {
    try {
        const menu_items = await Menu.find().lean()
        return res.render('layouts/customer/menu', {menu_items})
    } catch (err) {
        res.status(400)
        res.send("Database query failed")
    }
}

const register = async (req, res) => {
    var postData = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        password: req.body.password,
    };
  
    await User.findOne({email: postData.email}, async function (err, data) {
        try{
            if (data) {
                res.send('Username must be different. Redirecting to Registration in 3 seconds..');
                await new Promise(r => setTimeout(r, 3000));
                window.reload(false);
                return;
            } else {
                await User.create(postData, async function (err, data) {
                    if (err) throw err;
                    res.send('Registration succeeded. Redirecting to homepage in 3 seconds..');
                    await new Promise(r => setTimeout(r, 3000));
                    return res.redirect('/');  
                }) 
            }
        }catch{
            if(err) throw err;
        }
    });
}


const login = async (req, res) => {
    console.log(req.body.email);
    console.log(req.body.password);
    await User.findOne({
        email: req.body.email,
        password: req.body.password
    }, async function (err, user) {
        if(err) throw err;
        if(user){
            console.log("Login successful");
            await new Promise(r => setTimeout(r, 3000));
            return res.render("layouts/customer/customer-home", {user});
        }else{
            res.send('Login failed')
            await new Promise(r => setTimeout(r, 3000));
            window.reload();
            return;
        }
    } )
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

//make an order record and put it into the database
const orderItems = async (req, res) => {
    try {
        var i;
        var calculatedTotalPayment = 0
        for (i=0; i<req.body.orderItems.length;i++) {
            var singlePrice = await (await Menu.findOne({item_name:req.body.orderItems[i].item_name.toLowerCase()},{})).item_price
            // console.log(singlePrice)
            req.body.orderItems[i].price = req.body.orderItems[i].quantity * singlePrice
            calculatedTotalPayment = calculatedTotalPayment + req.body.orderItems[i].price
            // console.log(calculatedTotalPayment)
        }
        const newOrder = new Order({
            user_id : req.params.user_id,
            van_ID : req.body.van_ID,
            orderItems : req.body.orderItems,
            paymentSubTotal : calculatedTotalPayment
        })
        newOrder.save( (err, result) => {  // callback-style error-handler
            if (err) console.log(err)
            return res.send(result)
        })   
    } catch (err) {
        console.log(err)
    }
}


// make an order record and put it into the database
const postOrderItems = async (req, res) => {
    // console.log("Entered orderItems")
    try {
        var i;
        var calculatedTotalPayment = 0
        var userArray = { user_id : req.params.user_id}
        van = await Vendor.findOne({van_ID: req.body.van_ID}, {van_ID: true, locDescription: true, latitude: true, longtitude:true})
        var vanArray = {
            van_ID: van.van_ID,
            van_location: van.latitude + ", " +van.longtitude, 
            van_locDescription: van.locDescription 
        }
        const newOrder = new Order({
            user: userArray,
            van: vanArray,
            orderItems: req.body.orderItems,
            paymentSubTotal: calculatedTotalPayment
        })
        var order_ID;
        await newOrder.save( (err, result) => {  // callback-style error-handler
            if (err) console.log(err);
            console.log(result)
            order_ID = result._id;
        })

        for (i=0; i<req.body.orderItems.length;i++) {
            var singlePrice = await Menu.findOne({item_name:req.body.orderItems[i].item_name.toLowerCase()},{}).item_price
            var price = req.body.orderItems[i].quantity * singlePrice

            await Order.findById({_id: order_ID}, function(err,document) {
                document.orderItems[i] = price
                document.markModified("orderItems");
                console.log(price);
                document.save(function(err) {
                    return res.json({event:"Updated OrderItem"})
                })
            })
            calculatedTotalPayment = calculatedTotalPayment + req.body.orderItems[i].price
        }
        await Order.updateOne({_id : order_ID}, { paymentSubTotal : calculatedTotalPayment});
          
    } catch (err) {
        console.log(err)
    }
}

const getOrderDetail = async(req,res)=>{
    
    try{
        const order = await Order.findOne( {_id: new mongoose.Types.ObjectId(req.params.order_ID)}).lean()
        return res.render('layouts/customer/orderDetail', {order})
    }catch(err){
        console.log(err)
    }
}

module.exports = {
    getAllItems,
    getAllUserOrders,
    displayHome,
    displayMenu,
    displayMenu_hbs,
    login,
    getItemDetail,
    register,
    getOneUser,
    orderItems,
    getOrderDetail
}