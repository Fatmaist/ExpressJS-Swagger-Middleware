var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var pool = require('./queries')
var movies = require('./routes/movies')
var paginate = require('./paginate')
var jwt = require('jsonwebtoken')
var swaggerJsDoc = require('swagger-jsdoc')
var swaggerUi = require('swagger-ui-express')
var morgan = require('morgan')

app.use(morgan('tiny'))
app.use('/verify/:token', paginate)
app.use('/verify/:token', movies)

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

// verify token
app.get('/verify/:token', function (req, res) {
    const data = jwt.verify(
        req.params.token,
        'secretguys'
    )
    //check data same at table users and show data
    pool.query(`SELECT * FROM users WHERE email = '${data.email}' AND password = '${data.password}'`, (err, result) => {
        if (err) {
            throw err
        }
        res.send(result.rows)
    })
})

pool.connect((err, res) => {
    console.log(err)
    console.log('connected')
})

const options = {
    definition: {
        openapi: '3.0.1',
        info: {
            title: 'Express API with Swagger',
            version: '1.0.0',
            description: 'This is a simple CRUD API application made with Express and documented with Swagger',
        },
        servers: [
            {
                url: 'http://localhost:3000',
            }
        ]
    },
    apis: ['./routes/*.js'],
}

const specs = swaggerJsDoc(options);
app.use(
    '/api-docs', 
    swaggerUi.serve, 
    swaggerUi.setup(specs, { explorer: true }));

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.listen(3000)