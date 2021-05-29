const mongoose = require("mongoose")

//import models
const Order = mongoose.model("orders")
const Vendor = mongoose.model("vendors")


// middleware to ensure vendor is open
async function checkIsOpen(req, res, next){
    const vendor = await Vendor.findOne( {van_ID: req.params.van_ID} ).lean();
    console.log(vendor)
    if (vendor.isOpen)
        return next();
    // if not open, redirect to location form
    res.render('vendor/setLocation',{"vendor":vendor});
}

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
        console.log(req.params)
        order = await Order.findOne( {van_ID: req.params.van_ID, order_ID: req.params.order_ID}).lean()
        vendor = await Vendor.findOne( {van_ID: req.params.van_ID} ).lean()
        res.render('vendor/orderDetail',{"order":order, "vendor":vendor})
    }catch(err){
        console.log(err)
    }
}

// update the status of the order
const updateOrderStatus = async(req,res)=>{
    try{
        await Order.findOneAndUpdate({_id: req.params.order_id}, {status: req.body.status}, {returnNewDocument: true}, function (err){
        if (err) res.send('failed to update');
        else {res.render('vendor/orders');}
        })
    }catch(err){
        console.log(err)
    }
}

//marks an order as Fulfilled
const markAsFulfilled = async(req,res)=>{
    try{
        console.log(req.params)
        const orders = await Order.find({van_ID: req.params.van_ID, status :{$in: ['Unfulfilled']}}).lean()
        await Order.findOneAndUpdate({order_ID: req.params.order_ID}, {status: "Fulfilled"}, {returnNewDocument: true}, function (err){
        if (err) res.send('failed to update');
        else {res.render('vendor/orders',{"orders":orders});}
        })
    }catch(err){
        console.log(err)
    }
}

//marks an order as Complete
const markAsComplete = async(req,res)=>{
    try{
        console.log(req.params.order_ID)
        const orders = await Order.find({van_ID: req.params.van_ID, status :{$in: ['Unfulfilled']}}).lean()
        await Order.findOneAndUpdate({order_ID: req.params.order_ID}, {status: "Complete"}, {returnNewDocument: true}, function (err){
        if (err) res.send('failed to update');
        else {res.render('vendor/orders',{"orders":orders});}
        })
    }catch(err){
        console.log(err)
    }
}

// set the status of the van
const showSetVanStatus = async (req,res) => {
    try {
        const vendor = await Vendor.findOne( {van_ID: req.params.van_ID} ).lean()
        console.log(vendor)
        console.log(vendor.isOpen)
        res.render("vendor/setLocation", {vendor,"isOpen": vendor.isOpen});
    }
    catch(err){
        console.log(err)
    }
}


// set the status of the van
const SetVanStatus = async (req,res) => {
    try {
        console.log(req.params)
        console.log(req.body)
        console.log("setting location");
        const vendor = await Vendor.findOneAndUpdate({van_ID: req.params.van_ID},
            {latitude: req.body.latitude, longitude: req.body.longitude,
                isOpen: true, locDescription: req.body.locDescription}).lean()
        res.redirect('/vendor')
    }catch(err){
        console.log(err)
    }
}

const markLeavingLocation = async (req,res) => {
    try {
        const vendor = await Vendor.findOneAndUpdate({van_ID: req.params.van_ID},
            {latitude: req.body.latitude, longitude: req.body.longitude,
                isOpen: false, locDescription: req.body.locDescription}).lean()
        res.redirect('/vendor')
    }catch(err){
        console.log(err)
    }
}

//get all outstanding orders of a vendor (unfulfilled/fulfilled)
const getAllOutstandingOrders = async(req, res)=>{
    try{
        const vendor = await Vendor.findOne( {van_ID: req.params.van_ID} )
        const orders = await Order.find({van_ID: req.params.van_ID, status :{$in: ['Unfulfilled']}}).lean()
        orders.sort(function(a,b){
           return parseInt(a.when) - parseInt(b.when);
        })
       res.render('vendor/orders',{"orders": orders,"vendor":vendor})
    //    res.send(await Order.find({van_ID: req.params.van_ID}));
    }catch(err){
        console.log(err)
    }
}

//get all orders of a vendor
const getAllOrders = async(req, res)=>{
    try{
        const vendor = await Vendor.findOne( {van_ID: req.params.van_ID} ).lean()
        orders = await Order.find({van_ID: req.params.van_ID}).lean();
        res.render('vendor/orders',{"orders": orders, "vendor":vendor})
    }catch(err){
        console.log(err)
    }
}

const searchOrder = async (req, res) => { // search database for foods

	// if we get this far, there are no validation errors, so proceed to do the search ...
    console.log(req.body)
	var query = {}
    const vendor = await Vendor.findOne( {van_ID: req.params.van_ID} ).lean()
    query["van_ID"] = vendor.van_ID
	if (req.body.Order_ID !== '') {
		query["order_ID"] = req.body.order_ID
	}
    if (req.body.fulfilled){
        query["status"] = "fulfilled"
        if(req.body.complete){
            query["status"] = "complete"
        }
    }
	// the query has been constructed - now execute against the database

	try {
		const orders = await Order.find(query).lean()
        console.log(query)
        console.log(orders)
		res.render('vendor/orders', {"orders": orders, "vendor": vendor})
	} catch (err) {
		console.log(err)
	}
}

module.exports = {
    getOneVendor,
    getOneOrder,
    showSetVanStatus,
    SetVanStatus,
    updateOrderStatus,
    markAsFulfilled,
    markAsComplete,
    getAllOutstandingOrders,
    getAllOrders,
    checkIsOpen,
    markLeavingLocation,
    searchOrder
}