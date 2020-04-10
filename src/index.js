require('dotenv').config();
const path = require('path');
const fs = require('fs');
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const passport = require('passport');
require('./passport.js');
const mongoose = require('mongoose');
const Models = require('./models.js');
const { check, validationResult } = require('express-validator');
const generateJWTToken = require('./auth-jwt');

const app = express();
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const cors = require('cors');
app.use(cors());

const auth = require('./auth.js')(app); // Make sure this is after bodyParser, app ensures Express is available in auth.js as well

const argv = require('minimist')(process.argv.slice(2), { boolean: ['local'] });
const USE_LOCAL = argv.local;

const Movies = Models.Movie;
const Users = Models.User;

const CONNECTION_REMOTE_URL = process.env.REMOTE;
const CONNECTION_LOCAL_URL = 'mongodb://127.0.0.1:27017/myFlixDB';
const connectionUrl = USE_LOCAL ? CONNECTION_LOCAL_URL : CONNECTION_REMOTE_URL;

mongoose.connect(connectionUrl, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false
});

// var allowedOrigins = ['http://localhost:5500', 'movies-my-flix.herokuapp.com/'];
// app.use(cors({
//     origin: function (origin, callback) {
//         if (!origin) return callback(null, true);
//         if (allowedOrigins.indexOf(origin) === -1) { // If a specific origin isn’t found on the list of allowed origins
//             var message = 'The CORS policy for this application doesn’t allow access from origin ' + origin;
//             return callback(new Error(message), false);
//         }
//         return callback(null, true);
//     }
// }));

// Case insensitive search
function createSearchObject(key, value) {
    let rv = {};
    rv[key] = {
        $regex: new RegExp("^" + value, "i")
    }
    return rv;
}

// POST Requests

// Route: Unprotected: create new user
app.post('/users', [
    check('Username', 'Username is required').isLength({ min: 4 }),
    check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Password', 'Password is required').isLength({ min: 4 }),
    check('Email', 'Email does not appear to be valid').isEmail()
],
    (req, res) => {

        var errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        var hashedPassword = Users.hashPassword(req.body.Password);
        Users.findOne({ Username: req.body.Username })
            .then(function (user) {
                if (user) {
                    return res.status(400).send(`User ${req.body.Username} already exists`);
                } else {
                    Users
                        .create({
                            Username: req.body.Username,
                            Name: req.body.Name,
                            Password: hashedPassword,
                            Email: req.body.Email,
                            Birthday: req.body.Birthday
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

// Route: Protected: add movie to user favorites
app.post('/users/:Username/Movies/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => {
    Users.findOneAndUpdate(
        {
            Username: req.params.Username
        }, {
        $push: { FavoriteMovies: req.params.MovieID }
    },
        { new: true },
        (err, updatedUser) => {
            if (err) {
                console.error(err);
                res.status(500).send("Error: " + err);
            } else {
                res.json(updatedUser);
            }
        }
    );
});

// GET Requests

// Route: Unprotected: root
app.get('/', (req, res) => {
    res.contentType('html');
    res.end('<h1>This is the default</h1>');
});

// Route: Unprotected: get login page
app.get('/login', (req, res) => {
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

// Route: Protected: get list of users
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

// Route: Protected: get user information
app.get('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
    Users.findOne(createSearchObject('Username', req.params.Username))
        .then((user) => {
            res.json(user)
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send("Error: " + err);
        });
});

// Route: Protected: get list of movies
app.get('/movies', passport.authenticate('jwt', { session: false }), (req, res) => {
    Movies.find()
        .then((movies) => {
            res.status(201).json(movies);
        }).catch((err) => {
            console.log(err);
            res.status(500).send('Error: ' + err);
        });
});

// Route: Protected: find movie by title
app.get('/movies/:Title', passport.authenticate('jwt', { session: false }), (req, res) => {
    Movies.findOne(createSearchObject('Title', req.params.Title))
        .then((movie) => {
            res.json(movie)
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send("Error: " + err);
        });
});

// Route: Protected: find genre by name
app.get('/movies/genres/:Name', passport.authenticate('jwt', { session: false }), (req, res) => {
    Movies.findOne(createSearchObject('Genre.Name', req.params.Name))
        .then((movie) => {
            if (movie) {
                res.status(201).json(movie.Genre);
            } else {
                res.status(404).send(req.params.Name + " was not found.");
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send("Error:" + err);
        });
});

// Route: Protected: find director by name
app.get('/movies/directors/:Name', passport.authenticate('jwt', { session: false }), (req, res) => {
    Movies
        .findOne(createSearchObject('Director.Name', req.params.Name))
        .then((movie) => {
            res.status(201).json(movie.Director);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send("Error: " + err);
        });
});

// UPDATE Requests

// Route: Protected: Update user info
app.put('/users/:Username', [
    check('Username', 'Username is required').isLength({ min: 4 }),
    check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Password', 'Password is required').isLength({ min: 4 }),
    check('Email', 'Email does not appear to be valid').isEmail()
], passport.authenticate('jwt', { session: false }), (req, res) => {
    let oldName = req.params.Username;
    let newName = req.body.Username;

    function updateUser() {
        var hashedPassword = Users.hashPassword(req.body.Password);
        Users.findOneAndUpdate({ Username: oldName }, {
            $set: {
                Username: newName,
                Password: hashedPassword,
                Email: req.body.Email,
                Birthday: req.body.Birthday
            }
        }, { new: true }, (err, updatedUser) => {
            if (err) {
                console.error(err);
                res.status(500).send("Error: " + err);
            }
            else {
                let token = generateJWTToken(updatedUser.toJSON());
                res.json({ user: updatedUser, token });
            }
        });
    }

    if (oldName !== newName) {
        Users.findOne({ Username: newName })
            .then(function (user) {
                if (user) {
                    return res.status(400).send(`User ${newName} already exists`);
                } else {
                    updateUser();
                }
            }).catch(function (error) {
                console.error(error);
                res.status(500).send("Error: " + error);
            });
    } else {
        updateUser();
    }
});

// DELETE Requests

// Route: Protected: delete current user
app.delete('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
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

// Route: Protected: remove movie from user favorites
app.delete('/users/:Username/Movies/:MovieID', passport.authenticate('jwt', { session: false }),
    (req, res) => {
        Users.findOneAndUpdate(
            { Username: req.params.Username },
            { $pull: { FavoriteMovies: req.params.MovieID } },
            { new: true },
            (err, updatedUser) => {
                if (err) {
                    console.err(err);
                    res.status(500).send("Error: " + err);
                } else {
                    res.json(updatedUser);
                }
            }
        );
    }
);

const port = process.env.PORT || 5500;

app.listen(port, "0.0.0.0", () => {
    console.log(`listening on port ${port} ${new Date()} localhost with ${USE_LOCAL ? 'LOCAL' : 'REMOTE'} database`);
});
