const mongoose = require("mongoose")

//import models 
const Order = mongoose.model("orders")
const Vendor = mongoose.model("vendors")



const getOneVendor = async(req,res)=>{
    try{
        console.log(req.params.van_name);
        const queriedvendor = await Vendor.findOne( {van_name: req.params.van_name} ).lean()
        if (queriedvendor== null) res.send("Queried vendor not found");
        else res.send(queriedvendor);

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
        var update = {isReadyForOrder: req.body.isReadyForOrder}
        await Order.findOneAndUpdate({_id: req.params.order_id}, update, function (err){    
        if (err) res.json('failed to update');
        else {res.json('updated record');}
        })
    

        res.send(order)
    }catch(err){
        console.log(err)
    }
}


const showSetVanStatus = async (req,res) => {
    try {
        var conditions = {_id: req.body.id, van_name: req.params.van_name}
        var update = {latitude: req.body.latitude, longtitude: req.body.longtitude, status: req.body.status}
        user.findOneAndUpdate(conditions, update, function (err){
        if (err) res.json('failed to update');
        else {res.json('updated record');}
        })
    }
    catch(err){
        console.log(err)
    }
}

function filterArray(array, filters) {
    const filterKeys = Object.keys(filters);
    return array.filter(item => {
      // validates all filter criteria
      return filterKeys.every(key => {
        // ignores non-function predicates
        if (typeof filters[key] !== 'function') return true;
        return filters[key](item[key]);
      });
    });
}

const getAllOutstandingOrders = async(req, res)=>{
    try{
        const filters = {status : ['fulfilled', 'unfulfilled'].includes(status.toLowerCase())}
        res.send(filterArray(await Orders.find(), filters));
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
}