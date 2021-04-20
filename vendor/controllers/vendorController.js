const mongoose = require("mongoose")
const expressValidator = require('express-validator')

//import models 
const Order = mongoose.model("orders")
const Vendor = mongoose.model("vendors")


const setVanStatus = async (req,res) => {
    const validationErrors = experssValidator.validationResult(req)
    if (!validationErrors.isEmpty() ) {
		return res.status(422).render('error', {errorCode: '422', message: 'works on numbers only.'})
	}
    var query = {}
    if(req.body.latitude && req.body.longtitude !==''){
        query["latitude"] = {$regex: new RegExp(req.body.latitude, 'i') }
        query["longtitude"] = {$regex: new RegExp(req.body.longtitude, 'i') }
    }
    if(req.body.isReadyForOrder){
        query["isReadyForOrder"] = true
    }
    try {
        //update this query to the current vendor
        Vendor.updateMany(query,{$set: {latitude:query[latitude], longtitude:query[longtitude],isReadyForOrder:query[isReadyForOrder]}})
        res.render('setVanLocation');
    }
    catch(err){

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
    const validationErrors = expressValidator.validationResult(req)
    if (!validationErrors.isEmpty()){
		return res.status(422).render('error', {errorCode: '422', message: 'Search works on alphabet and numbers only.'})
    }
    console.log(req.body)
    var query = {}
    if(req.body.van_ID !== ''){
        query["van_ID"] =  {$regex: new RegExp(req.body.van_ID)}
    }
    try{
        const vendor = await Vendor.find(query, {name:true, van_ID:true}).lean()
        res.render('index',{"vendor":vendor})
    }catch(err){
        console.log(err)
    }
}

const getOneVendor = async(req,res)=>{
    try{
        const vendor = await Vendor.findOne({van_ID:req.params.id}).lean()
        res.render('showVendor',{"Vendor":vendor})
    }catch(err){
        console.log(err)
    }
}

const markOrderAsReady = async(req,res)=>{
    try{
        const order = await Order.findOne({OrderId:req.params.id}).lean()
        Order.updateOne(order.isFulfilled,req.body.isFulfilled)
        res.rendor('index')
    }catch(err){
        console.log(err)
    }
}


module.exports = {
    getAllOrders,
    searchVendorID,
    setVanStatus,
    getOneVendor,
    markOrderAsReady
}