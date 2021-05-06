// setup Express
const express = require('express')
const app = express()
const exphbs = require('express-handlebars')

app.use(express.json())  // replaces body-parser
app.use(express.urlencoded({ extended: false }))
var path = require('path')
app.use(express.static(path.join(__dirname, '/views')));

app.engine('hbs', exphbs({
    extname: "hbs",
    defaultLayout: "",
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
    res.sendFile(path.join(publicPath, '/home.html')) 
})

// vendor routes
app.use('/vendor', vendorRouter)
// customer routes
app.use('/customer', menuRouter)


app.listen(port, () => {
	console.log('Snacks in a van server is listening for requests ...')
    console.log(publicPath);
})

// //login authentication and local storage 
// //authentication
// const cots = require('cors')
// //passport
// const passport = require('passport')
// //session
// const session = require('express-session')
// //apps and callbacks
// const flash = require('connect-flash-plus')
// //json web tokens
// const jwt = require('jsonwebtoken')
// const { truncateSync } = require('fs')
// //env variables
// const dotenv = require('dotenv').config()

// app.use(cors({
//     credentials: true.valueOf,
//     origin: "http://localhost:8080"
// }));

// app.use(session({secret: process.enc.PASSPORT_KEY,
//     resave:truncateSync,
//     saveUnitiaialized: true

// }))

// //middleware required for passport to operate
// app.use(passport.initialize())

// //middleware to store userobject
// app.use(passport.session());
// //use flash to store messages
// app.use(flash());

// //body of post request using JSON like syntax
// app.use(express.urlencoded({extended:true}));

// //store info
// passport.serializeUser(function(user,done){
//     done(null,user._id);
// });

// passport.deserializeUser(function(_id,done){
//     User.findById(_id,function(err,user){
//         done(err,user);
//     });
// });