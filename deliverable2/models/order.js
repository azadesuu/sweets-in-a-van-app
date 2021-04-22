const mongoose = require("mongoose")
// const menu = require("./menu.js")

const orderItemSchema = new mongoose.Schema({
    item_name : {type: String},
    quantity : {type: Number}
})

const orderSchema = new mongoose.Schema({
    userId : {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User'},
    vanId : {type: mongoose.Schema.Types.ObjectId, required: true, ref :'Vendor'},
    orderItems : [orderItemSchema],
    status : {type: String},
    paymentTotal : {type: Number, detault: 0},
    late_fulfillment : {type: Boolean, default: true},
    when: {type: Date, default: Date.now}
},{ collection : 'orders' })

const Order = mongoose.model('orders', orderSchema)
const OrderItem = mongoose.model('order_items', orderItemSchema)
module.exports = {Order, orderSchema, OrderItem, orderItemSchema}