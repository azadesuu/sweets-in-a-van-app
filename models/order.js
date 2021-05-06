const mongoose = require("mongoose")
// const menu = require("./menu.js")

const orderItemSchema = new mongoose.Schema({
    item_name : {type: String},
    quantity : {type: Number},
    price: {type: Number}
})

const orderSchema = new mongoose.Schema({
    user:[{user_ID: String}],
    van: [{van_ID: String, van_location: String, locDescription: String}],
    orderItems : [orderItemSchema],
    status: {type: String, default: 'Unfulfilled'},
    paymentSubTotal : {type: Number, required: true},
    paymentTotal : {type: Number, default: 0},
    late_fulfillment : {type: Boolean, default: false},
    when: {type: Date, default: Date.now},
},{ collection : 'orders' })

const Order = mongoose.model('orders', orderSchema)
const OrderItem = mongoose.model('order_items', orderItemSchema)
module.exports = {Order, orderSchema, OrderItem, orderItemSchema}