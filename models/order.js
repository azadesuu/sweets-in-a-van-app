const mongoose = require("mongoose")
// const menu = require("./menu.js")

const orderItemSchema = new mongoose.Schema({
    item_name : {type: String},
    quantity : {type: Number},
    price: {type: Number}
})

const orderSchema = new mongoose.Schema({
    _id: {type: mongoose.Schema.Types.ObjectId, required: true},
    user_ID : {type: String, required: true, ref: 'User'},
    van_ID : {type: String, required: true, ref :'Vendor'},
    orderItems : [orderItemSchema],
    status : {type: String, default: 'Unfulfilled'},
    paymentTotal : {type: Number, default: 0},
    late_fulfillment : {type: Boolean, default: false},
    when: {type: Date, default: Date.now},
    van_latitude:{type: Number},
    van_longtitude:{type: Number}
},{ collection : 'orders' })

const Order = mongoose.model('orders', orderSchema)
const OrderItem = mongoose.model('order_items', orderItemSchema)
module.exports = {Order, orderSchema, OrderItem, orderItemSchema}