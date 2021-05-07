const mongoose = require("mongoose")
const userSchema = new mongoose.Schema({
    first_name: {type: String, required: true},
    last_name: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    longtitude: {type: Number, default:0},
    latitude: {type: Number, default:0},
    createAt: {
        type: Date,
        default : Date.now()
    }
},{ collection : 'users' })


const bcrypt = require('bcrypt-nodejs')
// method for generating a hash; used for password hashing
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};

// checks if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

const User = mongoose.model('users', userSchema)
module.exports = {User, userSchema}
