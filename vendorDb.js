const mongoose = require('mongoose')
let connectionURL = 'mongodb+srv://<username>:<password>@info30005-1.xpxvw.mongodb.net/app-server?retryWrites=true&w=majority'
mongoose.connect(connectionURL, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, dbName: 'info30005-1'})
const db = mongoose.connection

//event handler
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', () => {
    console.log('connected to Mongo')
})

const vendorSchema = new mongoose.Schema({
    name: {type: String, required: true, unique: true},
    photo: String,
    description: String,
    location: {type: Number}
})

const orderSchema = new mongoose.Schema({
    id: {type: Number, required: true, unique: true},
})


const vendor = mongoose.model('Vendor', vendorSchema)
const order = mongoose.model('Order',orderSchema)

module.exports = {vendor, order}