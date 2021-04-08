// setup Express
const express = require('express')
const app = express()
//const port = process.env.PORT || 8080
const port = 8080
var path = require('path')
app.use(express.json())  // replaces body-parser


// include Mongoose stuff
const {menu} = require('./db.js')
const {User} = require('./db.js')


// home page 
app.get('/', async (req, res) => {
    res.sendFile(path.join(__dirname, '/static/home.html'))
})

// menu page
app.get('/menu', async(req, res) => {
    result = await menu.find( {}, {} )
    res.send(result)
})


// // insert new item into collection
// app.post('/addItem', async (req, res) => {  // using POST for Postman demo
//     const newItem = new Item({
//         item_ID: req.body.item_ID,
//         item_name: req.body.item_name,
//         item_price: req.body.item_price,
//         item_photo: req.body.item_photo
//     })
//     newItem.save( (err, result) => {  // callback-style error-handler
//         if (err) res.send(err)
//         return res.send(result)
//     })                    
// })



app.listen(port, () => {
	console.log('Snacks in a van server listening for requests ...')
})

