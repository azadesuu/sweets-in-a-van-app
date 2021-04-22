const mongoose = require("mongoose")

//import models 
const Order = mongoose.model("orders")
const Vendor = mongoose.model("vendors")



const getOneVendor = async(req,res)=>{
    try{
        console.log(req.params.van_ID);
        vendor = await Vendor.findOne( {van_ID: req.params.van_ID} )
        if (vendor== null) res.send("Queried vendor not found");
        else res.send(vendor);

    }catch(err){
        console.log(err)
    }
}
const getOneOrder = async(req,res)=>{
    try{
        order = await Order.findOne( {_id: req.params.order_id})

        res.send(order)
    }catch(err){
        console.log(err)
    }
}

const updateOrderStatus = async(req,res)=>{
    try{
        await Order.findOneAndUpdate({_id: req.params.order_id}, {status: req.body.status}, {returnNewDocument: true}, function (err){    
        if (err) res.send('failed to update');
        else {res.send('updated record');}
        })
    }catch(err){
        console.log(err)
    }
}


const showSetVanStatus = async (req,res) => {
    try {
        await Vendor.findOneAndUpdate({van_ID: req.params.van_ID}, 
            {latitude: req.body.latitude, longtitude: req.body.longtitude, isReadyForOrder: req.body.isReadyForOrder}, function (err){
        if (err) res.send('failed to update');
        else {res.send('updated record');}
        })
    }
    catch(err){
        console.log(err)
    }
}

const getAllOutstandingOrders = async(req, res)=>{
    try{
       res.send(await Order.find({van_ID: req.params.van_ID, status :{$in: ['Fulfilled', 'Unfulfilled']}}))
    //    res.send(await Order.find({van_ID: req.params.van_ID}));
    }catch(err){
        console.log(err)
    }
}
const getAllOrders = async(req, res)=>{
    try{
       res.send(await Order.find({van_ID: req.params.van_ID}));
    }catch(err){
        console.log(err)
    }
}

module.exports = {
    getOneVendor,
    getOneOrder,
    showSetVanStatus,
    updateOrderStatus,
    getAllOutstandingOrders,
    getAllOrders
}