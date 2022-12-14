const mongoose = require("mongoose")
const vendorSchema = new mongoose.Schema({
    isOpen:{type: Boolean, default: false},
    latitude:{type: Number, default: 0},
    longitude:{type: Number, default:0},
    van_first_name: {type: String, required: true},
    van_last_name: {type: String, required: true},
    password: {type: String, required: true},
    van_ID:{type: String, required: true, unique:true},
    locDescription : {type:String, default: ""},
},{collection: 'vendors'})

const bcrypt = require('bcrypt-nodejs')
// method for generating a hash; used for password hashing
vendorSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};

// checks if password is valid
vendorSchema.methods.validPassword = function(password) {
    console.log(password)
    console.log(this.password)
    return bcrypt.compareSync(password, this.password);
};


const Vendor = mongoose.model('vendors', vendorSchema)
module.exports = {Vendor, vendorSchema}