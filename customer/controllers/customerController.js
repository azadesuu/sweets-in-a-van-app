const mongoose = require("mongoose")

// import models
const Menu = mongoose.model("menu")
const User = mongoose.model("users")



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

// handle requests to add an author
const addItem = (req, res) => {
    // assemble a new author
    newItem = req.body
    // add to database
    Menu.push(newItem)
    // return entire authors list to browser as a check that it worked
    res.send(authors)
}

module.exports = {
    getAllItems,
    displayMenu, 
    addItem
}