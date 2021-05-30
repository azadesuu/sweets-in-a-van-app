const mongoose = require("mongoose")

//import models
const Order = mongoose.model("orders")
const Vendor = mongoose.model("vendors")


// middleware to ensure vendor is open
async function checkIsOpen(req, res, next){
    const vendor = await Vendor.findOne( {van_ID: req.params.van_ID} ).lean();
    if (vendor.isOpen)
        return next();
    // if not open, redirect to location form
    res.render('vendor/setLocation',{"vendor":vendor});
}

// get details of a vendor
const getOneVendor = async(req,res)=>{
    try{
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
        const order = await Order.findOne( {van_ID: req.params.van_ID, order_ID: req.params.order_ID}).lean()
        const vendor = await Vendor.findOne( {van_ID: req.params.van_ID} ).lean()
        var timeCreated = order.when;
        timeCreated = timeCreated.getTime()/1000;
        var timeRemaining = 900 - (Date.now()/1000 - timeCreated)
        return res.render('vendor/orderDetail',{"order":order, "vendor":vendor,"timeRemaining": timeRemaining,"loggedin":req.isAuthenticated()})
    }catch(err){
        console.log(err)
    }
}

// update the status of the order
const updateOrderStatus = async(req,res)=>{
    try{
        await Order.findOneAndUpdate({_id: req.params.order_id}, {status: req.body.status}, {returnNewDocument: true}, function (err){
        if (err) res.send('failed to update');
        else {res.render('vendor/orders',{"loggedin":req.isAuthenticated()});}
        })
    }catch(err){
        console.log(err)
    }
}

//marks an order as Fulfilled
const markAsFulfilled = async(req,res)=>{
    try{
        const orders = await Order.find({van_ID: req.params.van_ID, status :{$in: ['Unfulfilled']}}).lean()
        await Order.findOneAndUpdate({order_ID: req.params.order_ID}, {status: "Fulfilled"}, {returnNewDocument: true}, function (err){
        if (err) res.send('failed to update');
        else {res.render('vendor/orders',{"orders":orders,"loggedin":req.isAuthenticated()});}
        })
    }catch(err){
        console.log(err)
    }
}

//marks an order as Complete
const markAsComplete = async(req,res)=>{
    try{
        const orders = await Order.find({van_ID: req.params.van_ID, status :{$in: ['Unfulfilled']}}).lean()
        await Order.findOneAndUpdate({order_ID: req.params.order_ID}, {status: "Complete"}, {returnNewDocument: true}, function (err){
        if (err) res.send('failed to update');
        else {res.render('vendor/orders',{"orders":orders,"loggedin":req.isAuthenticated()});}
        })
    }catch(err){
        console.log(err)
    }
}

// set the status of the van
const showSetVanStatus = async (req,res) => {
    try {
        const vendor = await Vendor.findOne( {van_ID: req.params.van_ID} ).lean()
        res.render("vendor/setLocation", {vendor,"isOpen": vendor.isOpen,"loggedin":req.isAuthenticated()});
    }
    catch(err){
        console.log(err)
    }
}


// set the status of the van
const SetVanStatus = async (req,res) => {
    try {
        await Vendor.findOneAndUpdate({van_ID: req.params.van_ID},
            {latitude: req.body.latitude, longitude: req.body.longitude,
                isOpen: true, locDescription: req.body.locDescription}).lean()
        res.redirect('/vendor')
    }catch(err){
        console.log(err)
    }
}

const markLeavingLocation = async (req,res) => {
    try {
        await Vendor.findOneAndUpdate({van_ID: req.params.van_ID},
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
        const vendor = await Vendor.findOne( {van_ID: req.params.van_ID} ).lean()
        const orders = await Order.find({van_ID: req.params.van_ID, status :{$in: ['Unfulfilled']}}).lean()
        orders.sort(function(a,b){
            return (a.when.getTime() - b.when.getTime());
        })
       res.render('vendor/orders',{"orders": orders,"vendor":vendor,"loggedin":req.isAuthenticated()})
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
        orders.sort(function(a,b){
            return (a.when.getTime() - b.when.getTime());
        })
        res.render('vendor/orders',{"orders": orders, "vendor":vendor,"loggedin":req.isAuthenticated()})
    }catch(err){
        console.log(err)
    }
}

const searchOrder = async (req, res) => { // search database for foods

	// if we get this far, there are no validation errors, so proceed to do the search ...
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
		res.render('vendor/orders', {"orders": orders, "vendor": vendor,"loggedin":req.isAuthenticated()})
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