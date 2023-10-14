var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var pool = require('./queries')
var query = require('./movies')
var jwt = require('jsonwebtoken')

app.use('/verify/:token', query)

app.use(express.json())
app.use(express.static('public'))

//create token from database at table users
app.get('/login', function (req, res) {
    const { email, password } = req.body
    if (!email || !password) {
        res.status(400)
        res.json({ message: "Bad request, Please input the email and password registered in the user database table in Body!" })
    } else {
        pool.query((`SELECT * FROM users WHERE email = '${email}' AND password = '${password}'`), (err, result) => {
            if (err) {
                res.status(400)
                res.json({ message: "Bad request" })
            } else {
                if (result.rows.length == 1) {
                    const token = jwt.sign({ email, password }, 'secretguys', { expiresIn: '1h'})
                    res.json({ token })
                } else {
                    res.status(400)
                    res.json({ message: "Bad request" })
                }
            }
        })
    }
})

app.get('/verify/:token', function (req, res) {
    const data = jwt.verify(
        req.params.token,
        'secretguys'
    )
    res.json({
        data: data,
    })
})

pool.connect((err, res) => {
    console.log(err)
    console.log('connected')
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.listen(3000)