const mongoose = require("mongoose")

//import models 
const Order = mongoose.model("orders")
const Vendor = mongoose.model("vendors")

const getAllOrders = (req,res)=>{
    res.send(Order)
}

module.exports = getAllOrders