/* Authentication related packages
--------------------------
npm install bcrypt
npm install bcrypt-nodejs
npm install body-parser ???
npm install jsonwebtoken
npm install express-session
npm install passport
npm install passport-jwt
npm install passport-local
npm install cookie-parser 
npm install connect-flash-plus [this is not really used in this app] 
npm install morgan [this is not really used in this app] 

*/

// Express stuff
const express = require('express')
// modules for authentication lectures
// make sure you enable CORS -- see Week 7 
// lectures for more information
const cors = require('cors');
// we will use passport.js, so include it
const passport = require('passport');
// we need to use session
const session = require('express-session');
// we can pass messages between app and callbacks
// we will not use it for this app
const flash = require('connect-flash-plus');
// for using JSON Web Tokens (JWT)
const jwt = require('jsonwebtoken');
// we use a few enviornment variables
const dotenv = require('dotenv').config()


// configure passport authenticator
require('./config/passport')(passport);

const app = express()

app.use(cors({
  credentials: true, // add Access-Control-Allow-Credentials to header
  origin: "http://localhost:8080" 
}));


// setup a session store signing the contents using the secret key
app.use(session({ secret: process.env.PASSPORT_KEY,
  resave: true,
  saveUninitialized: true
 }));

//middleware that's required for passport to operate
app.use(passport.initialize());

// middleware to store user object
app.use(passport.session());

// use flash to store messages
app.use(flash());

// we need to add the following line so that we can access the 
// body of a POST request as  using JSON like syntax
app.use(express.urlencoded({ extended: true })) 

// load the handlebars module 
const exphbs = require('express-handlebars')
app.use(express.json())  // replaces body-parser
app.use(express.urlencoded({ extended: false }))

var path = require('path')
app.use(express.static(path.join(__dirname, '/views')));

app.engine('hbs', exphbs({
    extname: "hbs",
    defaultLayout: "main",
    layoutsDir: "",
}))
app.set('view engine', 'hbs')

const port =  process.env.PORT || 8080

//connect database
require('./models');
//connect router
const vendorRouter = require('./routes/vendorRouter.js')
const menuRouter = require('./routes/menuRouter.js')
const publicPath = path.join(__dirname, './views');


app.get("/", (req, res) => {
    // res.sendFile(path.join(publicPath, '/home.html'))
    res.render('index') 
})

// vendor routes
app.use('/vendor', vendorRouter)
// customer routes
app.use('/customer', menuRouter)


app.listen(port, () => {
	console.log('Snacks in a van server is listening for requests ...')
})