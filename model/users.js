var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const bctypt= require('bcrypt-nodejs')
 

var userSchema = new Schema({
    
    username: {
        type: String,
        required:true,
        unique: true
    },
    password: {
        type: String,
        required:true
    },
    createAt: {
        type: Date,
        default : Date.now()
    }
});

userSchema.methods.generateHash = function(password) {
    return bcrypt.compareSync(password, bcrypt.genSaltSync(10), null);
};

userSchema.methods.validPassword= function (password){
    return bcrypt.compareSync(password, this.password);
}



module.exports = mongoose.model('users', userSchema)