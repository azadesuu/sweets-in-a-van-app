const mongoose = require("mongoose")
const vendorSchema = new mongoose.Schema({
    van_name: {type: String, required: true},
    isReadyForOrder:{type: Boolean, default: true},
    latitude:{type: Number, default: 0},
    longtitude:{type: Number, default:0},
    van_ID:{type: String, required: true, unique:true},
    locDescription : {type:String, default: ""}
},{collection: 'vendors'})

const Vendor = mongoose.model('vendors', vendorSchema)
module.exports = {Vendor, vendorSchema}