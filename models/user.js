const mongoose = require("mongoose")
const order = require("./order.js")
const userSchema = new mongoose.Schema({
    first_name: {type: String},
    last_name: {type: String},
    email: {type: String},
    password: {type: String},
    user_ID: {type: String, required: true, unique: true}, 
    longtitude: {type: Number},
    latitude: {type: Number}
},{ collection : 'users' })

const User = mongoose.model('users', userSchema)
module.exports = User