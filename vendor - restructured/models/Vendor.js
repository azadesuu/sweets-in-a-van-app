const mongoose = require('mongoose')
const vendorSchema = new mongoose.Schema({
    name: {type: String, required: true, unique: true},
    isReadyForOrders:{type: Boolean, default: true},
    latitude:{type: Number},
    longtitude:{type: Number}
},{collection: 'vendors'})

const vendor = mongoose.model('Vendor', vendorSchema)
module.exports = {vendor, vendorSchema}