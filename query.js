var express = require('express')
var router = express.Router()
var pool = require('./queries')
var bodyParser = require('body-parser')

router.use(bodyParser.json())

var movies = [
    //get data movie from database from table movies
    pool.query('SELECT * FROM movies', (err, result) => {
        if (err) {
            throw err
        }
        movies = result.rows
    })
]

//create router get from database at var movies
router.get('/movies', function (req, res) {
    res.send(movies)
})

//create router get from database at var movies by id
router.get('/:id', function (req, res) {
    var currMovie = movies.filter(function (movie) {
        if (movie.id == req.params.id) {
            return true
        }
    })
    if (currMovie.length == 1) {
        res.send(currMovie[0])
    } else {
        res.status(404)
        res.send('Not found')
    }
})

router.get('/movies/:id([0-9]{1,})', function (req, res) {
    var currMovie = movies.filter(function (movie) {
        if (movie.id == req.params.id) {
            return true
        }
    })
    if (currMovie.length == 1) {
        res.send(currMovie[0])
    } else {
        res.status(404)
        res.send('Not found')
    }
})

//create router post from database with table movies
router.post('/movies', function (req, res) {
    const { id, title, genres, year } = req.body
    if (!id || !title || !genres || !year) {
        res.status(400)
        res.json({message: "Bad request"})
    } else {
        pool.query((`INSERT INTO movies (id, title, genres, year) VALUES (${id}, '${title}', '${genres}', ${year})`), (err, result) => {
            if (err) {
                res.json({message: "Failed to insert!"})
                return
            }
            movies.push(req.body)
            res.json({message: "New movie created.", location: "/query/" + id})
        })
    }
})

//create router put from database at var movies by id
router.put('/movies/:id', function (req, res) {
    const { id, title, genres, year } = req.body
    if (!id || !title || !genres || !year) {
        res.status(400)
        res.json({message: "Bad request"})
    } else {
        pool.query((`UPDATE movies SET title = '${title}', genres = '${genres}', year = ${year} WHERE id = ${id}`), (err, result) => {
            if (err) {
                res.json({message: "Failed to update!"})
                return
            }
            movies = movies.filter(function (movie) {
                return movie.id != id
            })
            movies.push(req.body)
            res.json({message: "Movie id " + id + " updated.", location: "/query/" + id})
        })
    }
})

//create router delete from database at var movies by id
router.delete('/movies/:id', function (req, res) {
    var movieId = req.params.id
    
    pool.query('DELETE FROM movies WHERE id = $1', [movieId], (err, result) => {
        if (err) {
            res.send('Failed to delete!')
            return
        }
        if (result.rowCount === 0) {
            res.json({ message: 'Not Found.' })
        } else {
            movies = movies.filter(function (movie) {
                return movie.id != movieId
            })
            res.json({ message: "Movie id " + movieId + " removed.", location: "/query/" + movieId })
        }
    })
})

module.exports = router