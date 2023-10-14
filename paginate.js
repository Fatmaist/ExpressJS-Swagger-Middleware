var express = require('express')
var router = express.Router()
var pool = require('./queries')

var users = [
    pool.query('SELECT * FROM users', (err, result) => {
        if (err) {
            throw err
        }
        users = result.rows
    })
]

var movies = [
    pool.query('SELECT * FROM movies', (err, result) => {
        if (err) {
            throw err
        }
        movies = result.rows
    })
]

router.get('/users/paginate', function(req, res) {
    const page = parseInt(req.query.page)
    const limit = 10 //membatasi tampilan per 10 dari id users

    const startIndex = (page - 1) * limit
    const endIndex = page * limit

    const results = {}
    if (endIndex < users.length){
        results.next = {
            page: page + 1,
            limit: limit
        }
    }

    if (startIndex > 0){
        results.previous = {
            page: page - 1,
            limit: limit
        }
    }

    results.results = users.slice(startIndex, endIndex)

    res.json(results)
})

router.get('/movies/paginate', function(req, res) {
    const page = parseInt(req.query.page)
    const limit = 10 //membatasi tampilan per 10 dari id movies

    const startIndex = (page - 1) * limit
    const endIndex = page * limit

    const results = {}
    if (endIndex < movies.length){
        results.next = {
            page: page + 1,
            limit: limit
        }
    }

    if (startIndex > 0){
        results.previous = {
            page: page - 1,
            limit: limit
        }
    }

    results.results = movies.slice(startIndex, endIndex)

    res.json(results)
})

module.exports = router