const mongoose = require("mongoose")

// import models
const Menu = mongoose.model("menu")
const User = mongoose.model("user")


// menu page
const getAllItems = async (req, res) => {
    try {
        const menu_items = await Menu.find()
        return res.send(menu_items)
    } catch (err) {
        res.status(400)
        return res.send("Database query failed")
    }
}

module.exports = {
    getAllItems
}