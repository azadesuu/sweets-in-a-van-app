// setup Express
const express = require('express')
const app = express()
// process.env.PORT ||
const port =  8080
var path = require('path')
// const bodyParser = require('body-parser')
// const exphbs = require('express-handlebars')
app.use(express.json())  // replaces body-parser


//Mongoose stuff
const {vendor} = require('./vendorDb.js')
const {order} = require('./vendorDb.js')
//hbs
// app.engine('hbs', exphbs({
// 	defaultlayout: 'main',
// 	extname: 'hbs'
// }))

// app.set('view engine', 'hbs')

// app.use(bodyParser.urlencoded({extended:true}))

//home 
app.get('/', async (req, res) => {
    res.sendFile(path.join(__dirname, '/static/menu.html'))
})

//outstandingorders 
app.get('/allOutstandingOrders', async(req, res)=> {
    result = await order.find( {}, {} )
    res.send(result)
})
//setting van location
app.get('/setLocation', async(req, res)=>{
    res.sendFile(path.join(__dirname, '/static/setVanLocation.html'))
})

// app.post('/setLocation', async(req, res)=>{
//     const newLocation = new Location({
//         latitude: req.body.latitude,
//         longtitude: req.body.longtitude
//     })
//     newLocation.save((err, result)=>{
//         if(err) res.send(err)
//         return res.send(result)
//     })
// })

// start the server listening
app.listen(port, () => {
    console.log(`server is listening on port`, port)
})