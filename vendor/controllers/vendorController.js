const mongoose = require("mongoose")

//import models 
const Order = mongoose.model("orders")
const Vendor = mongoose.model("vendors")



const showSetVanStatus = async (req,res) => {
    try {
        const vendor = await Vendor.findOne( {_id: req.params.id} ).lean()
        res.render('setVanStatus',{"Vendor":vendor})
    }
    catch(err){
        console.log(err)
    }
}

const submitAndBack = async(req,res)=>{
    const vendor = await Vendor.findOne({_id:req.params.id}).lean()
    var query = {}
    //update this query to the current vendor
    if(req.body.latitude && req.body.longtitude !==''){
        query["latitude"] = {$regex: new RegExp(req.body.latitude, 'i') }
        query["longtitude"] = {$regex: new RegExp(req.body.longtitude, 'i') }
    }
    if(req.body.isReadyForOrder){
        query["isReadyForOrder"] = true
    }
    try{
        Vendor.updateMany(vendor,{$set: {latitude:query["latitude"], longtitude:query["longtitude"],isReadyForOrder:query["isReadyForOrder"]}})
        if(req.body !== null){
            res.render('successSetVendor',{"Vendor":vendor})
        }   
    }catch(err){
        console.log(err)
    }
    
}

const getAllOrders = async(req, res)=>{
    try{
        const orders = await Order.find({},{orderId:true, isFulfilled:true}).lean()
        res.render('allOutstandingOrders',{"orders":orders})
    }catch(err){
        console.log(err)
    }
}

const searchVendorID = async(req, res) =>{
    //console.log(req.body.van_ID)
    var query = {}
    if(req.body.van_ID !== ''){
        query["van_ID"] =  {$regex: new RegExp(req.body.van_ID)}
    }
    try{
        const vendors = await Vendor.find(query, {name:true, van_ID:true}).lean()
        res.render('index',{"vendors":vendors})
    }catch(err){
        console.log(err)
    }
}

const getOneVendor = async(req,res)=>{
    //console.log(req.params.id)
    try{
        const vendor = await Vendor.findOne( {_id: req.params.id} ).lean()
        res.render('showVendor',{"Vendor":vendor})
    }catch(err){
        console.log(err)
    }
}

const markOrderAsReady = async(req,res)=>{
    try{
        const order = await Order.findOne({OrderId:req.params.id}).lean()
        Order.updateOne(order.isFulfilled,req.body.isFulfilled)
        res.rendor('successMarkOrder')
    }catch(err){
        console.log(err)
    }
}

const showOrder = async(req,res)=>{
    const order = await Order.findOne({OrderId:req.params.id}).lean()
    res.rendor('showOrder',{"orders": order})
}


module.exports = {
    getAllOrders,
    searchVendorID,
    showSetVanStatus,
    getOneVendor,
    markOrderAsReady,
    submitAndBack,
    showOrder
}