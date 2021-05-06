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
 
const displayMenu_hbs = async (req, res) => {
    try {
        const menu_items = await Menu.find().lean()
        return res.render('layouts/menu', {menu_items})
        //res.send(menu_items);
    } catch (err) {
        res.status(400)
        res.send("Database query failed")
    }
}

const register = async (req, res) => {
    var postData = {
        username: req.body.username,
        password: req.body.password,
    };
  
    User.findOne({username: postData.username}, function (err, data) {
        if (data) {
            res.send('Username must be different');
        } else {
            User.create(postData, function (err, data) {
                if (err) throw err;
                console.log('Registration succeeded');
                res.redirect('/home');  
            }) 
        }
    });
}


const login = async (req, res) => {
    var postData = {
        username: req.body.username,
        password: req.body.password
    };
    User.findOne({
        username: postData.username,
        password: postData.password
    }, function (err, data) {
        if(err) throw err;
        if(data){
            return res.redirect('home', {user});
        }else{
            return res.send('Login failed')
        }
    } )
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

//make an order record and put it into the database
const orderItems = async (req, res) => {
    // console.log("Entered orderItems")
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
            user_ID : req.params.user_ID,
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
        var userArray = { user_ID : req.params.user_ID}
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
        return res.render('layouts/orderDetail', {order})
    }catch(err){
        console.log(err)
    }
}

module.exports = {
    getAllItems,
    getAllUserOrders,
    displayMenu,
    displayMenu_hbs,
    login,
    getItemDetail,
    register,
    getOneUser,
    orderItems,
    getOrderDetail
}