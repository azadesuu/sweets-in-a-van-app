// setup Express
const mongoose = require("mongoose")
const express = require('express')
const app = express()
// process.env.PORT ||
const port =  8080
const bodyParser = require('body-parser')
const exphbs = require('express-handlebars')
require('./models');
const vendorRouter = require('./routes/vendorRouter.js')
const vendorController = require('./controllers/vendorController.js')
app.engine('hbs', exphbs({
	defaultlayout: 'main',
	extname: 'hbs'
}))

app.set('view engine', 'hbs')
app.use(bodyParser.urlencoded({extended:true}))


app.get('/setVanLocation', async(req, res)=>{
    res.render('setVanStatus')
})

app.use('/',vendorRouter)

app.listen(port, () => {
    console.log(`server is listening on port`, port)
})