const mongoose = require('mongoose')
let connectionURL = 'mongodb+srv://anything30005:F5Nruod8fTvdNTCz@info30005-1.xpxvw.mongodb.net/app-server'
mongoose.connect(connectionURL, {
        useNewUrlParser: true, 
        useCreateIndex: true,
        useUnifiedTopology: true, 
        useFindAndModify: false,
        dbName: 'app-server'})
const db = mongoose.connection

db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', () => {
    console.log('Connected to Mongo')
})

require("./order");
require("./vendor");
require("./menu");
require("./user");