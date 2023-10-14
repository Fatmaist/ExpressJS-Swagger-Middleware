var express = require('express')
var app = express()
var pool = require('./queries')

app.get('/', function (req, res) {
    res.send('Hello World!')
})

pool.connect((err, res) => {
    console.log(err)
    console.log('connected')
})

app.listen(3000)