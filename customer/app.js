// setup Express
const mongoose = require("mongoose")
const express = require('express')
const app = express()
//const port = process.env.PORT || 8080
const port = 8080
app.use(express.json())  // replaces body-parser
require("./models");
const customerRouter = require('./routes/customerRouter.js')


var path = require('path')

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, '/static/home.html'))
})

app.use('/menu', customerRouter)

app.listen(port, () => {
	console.log('Snacks in a van server listening for requests ...')
})

