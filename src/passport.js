const passport = require('passport');
const LocalStrategy = require('passport-local');
const Models = require('./models.js');
const passportJWT = require('passport-jwt');
const { check, validationResult } = require('express-validator');

var Users = Models.User;

passport.use(new LocalStrategy({
    usernameField: 'Username',
    passwordField: 'Password'
}, (username, password, done) => {
    console.log(username + '  ' + password);
    Users.findOne({ Username: username }, (error, user) => {
        if (error) {
            console.log(error);
            return done(error);
        }
        if (!user) {
            console.log('User not found');
            return done(null, false, { message: 'User not found.' });
        }
        if (!user.validatePassword(password)) {
            console.log('incorrect password');
            return done(null, false, { message: 'Incorrect password.' });
        }
        console.log('finished');
        return done(null, user);
    });
}));

var JWTStrategy = passportJWT.Strategy;
var ExtractJWT = passportJWT.ExtractJwt;

passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'your_jwt_secret'
}, (jwtPayload, callback) => {
    return Users.findById(jwtPayload._id)
        .then((user) => {
            return callback(null, user);
        })
        .catch((error) => {
            return callback(error)
        });
}));