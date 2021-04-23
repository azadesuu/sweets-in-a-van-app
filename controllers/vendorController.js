const mongoose = require("mongoose")

//import models 
const Order = mongoose.model("orders")
const Vendor = mongoose.model("vendors")


// get details of a vendor
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

//get details of an order (of the van)
const getOneOrder = async(req,res)=>{
    try{
        order = await Order.findOne( {van_ID: req.params.van_ID, _id: req.params.order_id})
        res.send(order)
    }catch(err){
        console.log(err)
    }
}

// update the status of the order
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

//marks an order as Fulfilled
const markAsFulfilled = async(req,res)=>{
    try{
        await Order.findOneAndUpdate({_id: req.params.order_id}, {status: "Fulfilled"}, {returnNewDocument: true}, function (err){    
        if (err) res.send('failed to update');
        else {res.send('updated record to fulfilled');}
        })
    }catch(err){
        console.log(err)
    }
}

//marks an order as Complete
const markAsComplete = async(req,res)=>{
    try{
        await Order.findOneAndUpdate({_id: req.params.order_id}, {status: "Complete"}, {returnNewDocument: true}, function (err){    
        if (err) res.send('failed to update');
        else {res.send('updated record to complete');}
        })
    }catch(err){
        console.log(err)
    }
}


// set the status of the van
const showSetVanStatus = async (req,res) => {
    try {
        await Vendor.findOneAndUpdate({van_ID: req.params.van_ID}, 
            {latitude: req.body.latitude, longtitude: req.body.longtitude, 
                isReadyForOrder: req.body.isReadyForOrder, locDescription: req.body.locDescription}, function (err){
        if (err) res.send('failed to update');
        else {res.send('updated record');}
        })
    }
    catch(err){
        console.log(err)
    }
}

//get all outstanding orders of a vendor (unfulfilled/fulfilled)
const getAllOutstandingOrders = async(req, res)=>{
    try{
       res.send(await Order.find({van_ID: req.params.van_ID, status :{$in: ['Fulfilled', 'Unfulfilled']}}))
    //    res.send(await Order.find({van_ID: req.params.van_ID}));
    }catch(err){
        console.log(err)
    }
}

//get all orders of a vendor
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
    markAsFulfilled,
    markAsComplete,
    getAllOutstandingOrders,
    getAllOrders
}