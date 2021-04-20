// setup Express
const express = require('express')
const app = express()
app.use(express.static('public'))
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

app.use('/',vendorRouter)

app.all('*', (req, res) => {  // 'default' route to catch user errors
	res.status(404).render('error', {errorCode: '404', message: 'That route is invalid.'})
})

app.listen(port, () => {
    console.log(`server is listening on port`, port)
})