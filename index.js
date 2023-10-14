var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var pool = require('./queries')
var query = require('./query')

app.use('/query', query)

app.use(express.json())
app.use(express.static('public'))

app.get('/', function (req, res) {
    res.send('Hello World!')
})

pool.connect((err, res) => {
    console.log(err)
    console.log('connected')
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(3000)