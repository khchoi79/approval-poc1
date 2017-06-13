var express = require('express')
var app = express()
var path = require('path')

var port = process.env.PORT || 8080
app.use(express.static(path.join(__dirname, '/public')))

var bodyParser = require('body-parser')
var cors = require('cors')

app.use(bodyParser.json())
app.use(cors())


app.use('/api/v1', require('./routes/api_v1'))

app.listen(port)
console.log('Listening on port ', port)
