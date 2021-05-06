const mongoose = require("mongoose")
const userSchema = new mongoose.Schema({
    first_name: {type: String, required: true},
    last_name: {type: String, required: true},
    email: {type: String, requied: true},
    password: {type: String, required: true},
    user_ID: {type: String, required: true, unique: true}, 
    longtitude: {type: Number},
    latitude: {type: Number}
},{ collection : 'users' })

const User = mongoose.model('users', userSchema)
module.exports = {User, userSchema}

// const bcrypt= require('bcrypt-nodejs')

// //generate hash
// userSchema.methods.generateHash = function(password) {
//     return bcrypt.compareSync(password, bcrypt.genSaltSync(10), null);
// };

// //check if password valid
// userSchema.methods.validPassword= function (password){
//     return bcrypt.compareSync(password, this.password);
// }
