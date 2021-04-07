// setup Express
const express = require('express')
const app = express()
// process.env.PORT ||
const port =  8080
var path = require('path')
app.use(express.json())  // replaces body-parser

const {vendor} = require('./vendorDb.js')
const {order} = require('./vendorDb.js')


//home 
app.get('/', async (req, res) => {
    res.sendFile(path.join(__dirname, 'menu.html'))
})


// start the server listening
app.listen(port, () => {
    console.log(`server is listening on port`, port)
})