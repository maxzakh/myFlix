const path = require('path');
const fs = require('fs');
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const passport = require('passport');
require('./passport.js');
const mongoose = require('mongoose');
const Models = require('./models.js');
const {check, validationResult} = require('express-validator');

const app = express();
app.use(morgan('dev'));
app.use(bodyParser.json());

const auth = require('./auth.js')(app); // Make sure this is after bodyParser, app ensures Express is available in auth.js as well
const cors = require('cors');
app.use(cors());

const Movies = Models.Movie;
const Users = Models.User;

var allowedOrigins = ['http://localhost:5500', 'http://testsite.com'];
mongoose.connect('mongodb+srv://maxzakh:<password>@movies-my-flix-0j4lo.mongodb.net/test?retryWrites=true&w=majority', { useNewUrlParser: true });

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) { // If a specific origin isn’t found on the list of allowed origins
            var message = 'The CORS policy for this application doesn’t allow access from origin ' + origin;
            return callback(new Error(message), false);
        }
        return callback(null, true);
    }
}));

// POST Requests
app.post('/users',
    [check('Username', 'Username is required').isLength({ min: 4 }),
    check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail()],
    (req, res) => {

        var errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        var hashedPassword = Users.hashPassword(req.body.Password);
        Users.findOne({ Username: req.body.Username })
            .then(function (user) {
                if (user) {
                    return res.status(400).send(req.body.Username + "already exists");
                } else {
                    Users
                        .create({
                            Username: req.body.Username,
                            Name: req.body.Name,
                            Password: hashedPassword,
                            Email: req.body.Email,
                        })
                        .then(function (user) {
                            res.status(201).json(user)
                        })
                        .catch(function (error) {
                            console.error(error);
                            res.status(500).send("Error: " + error);
                        })
                }
            }).catch(function (error) {
                console.error(error);
                res.status(500).send("Error: " + error);
            });
    });

app.post('/users/:Username/Movies/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => {
    Users.findOneAndUpdate({ Username: req.params.Username }, {
        $push: { FavoriteMovies: req.params.MovieID }
    },
        { new: true },
        (err, updatedUser) => {
            if (err) {
                console.error(err);
                res.status(500).send("Error: " + err);
            } else {
                res.json(updatedUser)
            }
        })
});

// GET Requests
app.get('/', (req, res) => {
    res.contentType('html');
    res.end('<h1>This is the default</h1>');
});

app.get('/login', passport.authenticate('jwt', { session: false }), (req, res) => {
    let login = path.join(__dirname, '../public/login.html');
    fs.readFile(login, (err, data) => {
        if (err) {
            res.status(500);
            res.send(`Error: ${err}`);
            return;
        }
        res.send(data.toString());
    });
});

app.get('/users', passport.authenticate('jwt', { session: false }), (req, res) => {
    Users.find()
        .then((users) => {
            res.status(201).json(users)
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send("Error: " + err);
        });
});

app.get('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
    Users.findOne({ Username: req.params.Username })
        .then((user) => {
            res.json(user)
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send("Error: " + err);
        });
});

app.get('/movies', passport.authenticate('jwt', { session: false }), (req, res) => {
    Movies.find()
        .then((movies) => {
            res.status(201).json(movies);
        }).catch((err) => {
            console.log(err);
            res.status(500).send('Error: ' + err);
        });
});

app.get('/movies/:Title', passport.authenticate('jwt', { session: false }), (req, res) => {
    Movies.findOne({ Title: req.params.Title })
        .then((movie) => {
            res.json(movie)
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send("Error: " + err);
        });
});

app.get('/movies/genres/:Title', passport.authenticate('jwt', { session: false }), (req, res) => {
    Movies.findOne({ 'Genre.Title': req.params.Title })
        .then((movie) => {
            if (movie) {
                res.status(201).json(movie.Genre);
            } else {
                res.status(404).send(req.params.Title + " was not found.");
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send("Error:" + err);
        });
});

app.get('/movies/directors/:Name', passport.authenticate('jwt', { session: false }), (req, res) => {
    Movies.findOne({ 'Director.Name': req.params.Name })
        .then((movie) => {
            res.status(201).json(movie.Director);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send("Error: " + err);
        })
});

// UPDATE Requests
app.put('/users/:Username', (req, res) => {
    Users.findOneAndUpdate({ Username: req.params.Username }, {
        $set:
        {
            Username: req.body.Username,
            Password: req.body.Password,
            Email: req.body.Email,
            Birthday: req.body.Birthday
        }
    },
        { new: true }, // This line makes sure that the updated document is returned
        (err, updatedUser) => {
            if (err) {
                console.error(err);
                res.status(500).send("Error: " + err);
            } else {
                res.json(updatedUser)
            }
        })
});

// DELETE Requests
app.delete('/users/:Username', (req, res) => {
    Users.findOneAndRemove({ Username: req.params.Username })
        .then((user) => {
            if (!user) {
                res.status(400).send(req.params.Username + " was not found");
            } else {
                res.status(200).send(req.params.Username + " was deleted.");
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send("Error: " + err);
        });
});

const port = process.env.PORT || 5500;

app.listen(port, "0.0.0.0", () => {
    console.log(`listening on port ${port}`);
});