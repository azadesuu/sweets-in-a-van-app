var mongoose = require('mongoose');
var Schema = mongoose.Schema;
 

var userSchema = new Schema({
    username: {
        type: String,
        unique: true
    },
    password: {
        type: String
    },
    createAt: {
        type: Date,
        default : Date.now()
    }
});

module.exports = mongoose.model('users', userSchema)