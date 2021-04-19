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
        //const vendorStatus = await Vendor.create
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



module.exports = {
    getAllOrders
}