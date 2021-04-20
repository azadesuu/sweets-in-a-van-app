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
    try {
        // do something
    } catch (err) {
        // handling the err
    }
}

module.exports = {
    getAllItems,
    displayMenu,
    getItemDetail
}