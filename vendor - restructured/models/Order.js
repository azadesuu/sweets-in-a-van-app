const mongoose = require('mongoose')
const orderSchema = new mongoose.Schema({
    id: {type: Number, required: true, unique: true},
    isFulfilled: {type: Boolean, default:false}
},{collection: 'orders'})

const order = mongoose.model('Order',orderSchema)
module.exports = {order, orderSchema}