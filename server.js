const express = require('express')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const mongoose = require('mongoose')
const morgan = require('morgan')
const routes = require('./routes')
const PORT = 8811
const IP = '0.0.0.0'
const MONGODB_URL = 'mongodb://localhost/bwhacks'
const app = express()

app.use(morgan('dev'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(methodOverride())
//app.use(express.static(__dirname + '/views'))
app.use('/', routes)

mongoose.connect(MONGODB_URL)
mongoose.connection.on('open', () => console.log('Connected to database'))

app.listen(PORT, IP, () => console.log(`Server started at ${IP}:${PORT}`))
