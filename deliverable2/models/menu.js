const mongoose = require("mongoose")
// define the Food schema
const itemSchema = new mongoose.Schema({
    item_ID: {type: String},
    item_name: {type: String},
    item_price: {type: Number},
    item_photo: {type: String},}
    ,{ collection : 'menu' }
)

const menu = mongoose.model('menu', itemSchema)
module.exports = {menu, itemSchema}