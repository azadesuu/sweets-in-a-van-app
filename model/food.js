var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var foodSchema = new Schema({  // declare a Mongoose schema
    item_name:{type:String},
    item_photo:{type:String},
    item_price:{type:String},
  })
  

 module.exports = mongoose.model('menu', userSchema)