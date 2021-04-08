const mongoose = require('mongoose')
let connectionURL = 'mongodb+srv://anything30005:F5Nruod8fTvdNTCz@info30005-1.xpxvw.mongodb.net/app-server'
mongoose.connect(connectionURL, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, dbName: 'app-server'})
const db = mongoose.connection

db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', () => {
    console.log('connected to Mongo')
})

// define the Food schema
const itemSchema = new mongoose.Schema({
    item_ID: {type: String},
    item_name: {type: String},
    item_price: {type: Number},
    item_photo: {type: String}
})

const userSchema = new mongoose.Schema({
    first_name: {type: String},
    last_name: {type: String},
    email: {type: String},
    password: {type: String},
    user_ID: {type: String, required: true, unique: true}
})

const menu = mongoose.model('menu', itemSchema)
const User = mongoose.model('User', userSchema)

module.exports = {menu, User}