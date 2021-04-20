// setup Express
const mongoose = require("mongoose")
const express = require('express')
const app = express()
//const port = process.env.PORT || 8080
const port = 8080
app.use(express.json())  // replaces body-parser
require("./models");
const menuRouter = require('./routes/menuRouter.js')
var path = require('path')

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, '/static/home.html')) 
})

app.use('/menu', menuRouter)

app.listen(port, () => {
	console.log('Snacks in a van server listening for requests ...')
})

