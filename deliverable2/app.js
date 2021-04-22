// setup Express
const express = require('express')
const app = express()
app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
// process.env.PORT ||
const port =  8080
//handlebar 
const exphbs = require('express-handlebars')
app.engine('hbs', exphbs({
	defaultlayout: 'main',
	extname: 'hbs'
}))
app.set('view engine', 'hbs')
//connect database
require('./models');
//connect router
const vendorRouter = require('./routes/vendorRouter.js')
const menuRouter = require('./routes/menuRouter.js')
var path = require('path')

// vendor routes
app.use('/vendor', vendorRouter)
app.use('/customer', menuRouter)

app.listen(port, () => {
	console.log('Snacks in a van server listening for requests ...')
})

