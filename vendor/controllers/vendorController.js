const mongoose = require("mongoose")

//import models 
const Order = mongoose.model("orders")
const Vendor = mongoose.model("vendors")

const getAllOrders = async (req,res) => {
    try{
        const orders = await Order.find()
        return res.send(orders)
    }catch(err){
        res.status(400)
        return res.send("Database query failed")
    }
}

module.exports = {
    getAllOrders
}