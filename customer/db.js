const mongoose = require('mongoose')
let connectionURL = 'mongodb+srv://anything30005:F5Nruod8fTvdNTCz@info30005-1.xpxvw.mongodb.net/app-server?retryWrites=true&w=majority'
mongoose.connect(connectionURL, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, dbName: 'app-server'})
const db = mongoose.connection

db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', () => {
    console.log('connected to Mongo')
})

// define the Food schema
const itemSchema = new mongoose.Schema({
    item_ID: {type: String, required: true, unique: true},
    item_name: {type: String, required: true, unique: true},
    item_price: Number,
    item_photo: String
})

const userSchema = new mongoose.Schema({
    first_name: {type: String, required: true},
    last_name: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    user_ID: {type: String, required: true, unique: true}
})

const Item = mongoose.model('Item', itemSchema)
const User = mongoose.model('User', userSchema)

module.exports = {Item, User}