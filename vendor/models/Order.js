const mongoose = require('mongoose')
const orderSchema = new mongoose.Schema({
    id: {type: Number, required: true, unique: true},
    isFulfilled: {type: Boolean, default:false}
},{collection: 'orders'})

const Order = mongoose.model('orders',orderSchema)
module.exports = {Order, orderSchema}