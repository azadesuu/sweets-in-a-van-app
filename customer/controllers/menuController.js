const mongoose = require("mongoose")

// import models
const Menu = mongoose.model("menu")
const Order = mongoose.model("orders")



// get all items
const getAllItems = async (req, res) => {
    try {
        const menu_items = await Menu.find()
        return res.send(menu_items)
    } catch (err) {
        res.status(400)
        return res.send("Database query failed")
    }
}

//menu page
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
    try {
        const menu_items = await Menu.find({item_name:req.params.name}, {})
        return res.send(menu_items)
    } catch (err) {
        res.status(400)
        return res.send("Database query failed")
    }
}

// get one food - user specifies its name
const orderItems = async (req, res) => {
    // console.log("Entered orderItems")
    try {
        var i;
        var calculatedTotalPayment = 0
        for (i=0; i<req.body.orderItems.length;i++) {
            var singlePrice = (await Menu.findOne({item_name:req.body.orderItems[i].item_name},{})).item_price
            // console.log(singlePrice)
            calculatedTotalPayment = calculatedTotalPayment + req.body.orderItems[i].quantity * singlePrice
            // console.log(calculatedTotalPayment)
        }
        const newOrder = new Order({
            userId : req.body.userId,
            vanId : req.body.vanId,
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

module.exports = {
    getAllItems,
    displayMenu,
    getItemDetail,
    orderItems
}