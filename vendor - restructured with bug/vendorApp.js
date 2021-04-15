// setup Express
const express = require('express')
const app = express()
// process.env.PORT ||
const port =  8080
const bodyParser = require('body-parser')
const exphbs = require('express-handlebars')

const vendorRouter = require('./routes/vendorRouter.js')

app.engine('hbs', exphbs({
	defaultlayout: 'main',
	extname: 'hbs'
}))

app.set('view engine', 'hbs')
app.use(bodyParser.urlencoded({extended:true}))

//home 
app.get('/', async (req, res) => {
    res.render('index')
})

app.use('/vendor-management',vendorRouter)

app.listen(port, () => {
    console.log(`server is listening on port`, port)
})