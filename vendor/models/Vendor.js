const mongoose = require("mongoose")
const vendorSchema = new mongoose.Schema({
    name: {type: String, required: true, unique: true},
    isReadyForOrder:{type: Boolean, default: true},
    latitude:{type: Number},
    longtitude:{type: Number},
    van_ID:{type: String, required: true, unique:true}
},{collection: 'vendors'})

const Vendor = mongoose.model('vendors', vendorSchema)
module.exports = {Vendor, vendorSchema}