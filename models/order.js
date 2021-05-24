const mongoose = require("mongoose")

const orderItemSchema = new mongoose.Schema({
    item_name : {type: String},
    quantity : {type: Number},
    price: {type: Number}
})

const orderSchema = new mongoose.Schema({
    user_ID : {type: String, required: true, ref: 'User'},
    van_ID : {type: String, required: true, ref :'Vendor'},
    order_ID:{type: String, required: true},
    orderItems : [orderItemSchema],
    status : {type: String, default: 'Unfulfilled'},
    paymentTotal : {type: Number, default: 0},
    late_fulfillment : {type: Boolean, default: false},
    when: {type: Date, default: Date.now},
    timeRemainingForDiscount:{type:Number, default: 900},
    customerGivenName:{type:String,default: ""}
},{ collection : 'orders' })



const Order = mongoose.model('orders', orderSchema)
const OrderItem = mongoose.model('order_items', orderItemSchema)
module.exports = {Order, orderSchema, OrderItem, orderItemSchema}