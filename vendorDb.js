const mongoose = require('mongoose')
let connectionURL = 'mongodb+srv://anything30005:F5Nruod8fTvdNTCz@info30005-1.xpxvw.mongodb.net/app-server'
mongoose.connect(connectionURL, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, dbName: 'app-server'})
const db = mongoose.connection

//event handler
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', () => {
    console.log('connected to Mongo')
})

const locationSchema = new mongoose.Schema({
    latitude:{type: Number},
    longtitude:{type: Number}
})

const orderSchema = new mongoose.Schema({
    id: {type: Number, required: true, unique: true},
    isFulfilled: {type: Boolean, default:false}
})

const vendorSchema = new mongoose.Schema({
    name: {type: String, required: true, unique: true},
    isReadyForOrders:{type: Boolean, default: true},
    location: [locationSchema]
})

const location = mongoose.model('Location', locationSchema)
const vendor = mongoose.model('Vendor', vendorSchema)
const order = mongoose.model('Order',orderSchema)
module.exports = {vendor, order, location}