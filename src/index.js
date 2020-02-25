const path = require('path');
const fs = require('fs');
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const passport = require('passport');
require('./passport.js');
const mongoose = require('mongoose');
const Models = require('./models.js');

const app = express();
app.use(morgan('dev'));
app.use(bodyParser.json());

const auth = require('./auth.js')(app); // Make sure this is after bodyParser, app ensures Express is available in auth.js as well

const Movies = Models.Movie;
const Users = Models.User;

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

app.get('/movies', passport.authenticate('jwt', { session: false }), (req, res) => {
    Movies.find()
        .then((movies) => {
            res.status(201).json(movies);
        }).catch((error) => {
            console.log(error);
            res.status(500).send('Error: ' + error);
        });
});

app.get('/movies/:title', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.json(Movies.find((movie) => {
        return movie.title === req.params.title
    }));
});

app.get('/', (req, res) => {
    res.contentType('html');
    res.end('<h1>This is the default</h1>');
});

const port = process.env.PORT || 5500;

app.listen(port, () => {
    console.log(`listening on port ${port}`);
});