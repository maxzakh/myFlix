var jwtSecret = 'your_jwt_secret'; // Same key used in jwtStrategy
var jwt = require('jsonwebtoken');
const passport = require('passport');
// require('./passport.js') // Local passport file

function generateJWTToken(user) {
    return jwt.sign(user, jwtSecret, {
        subject: user.Username, // Username you are encoding
        expiresIn: '7d', // Durationg of token
        algorithm: 'HS256' // Encoding the values of the JWT
    });
}

/* POST login */
module.exports = (router) => {
    router.post('/login', (req, res) => {
        passport.authenticate('local', { session : false }, (error, user, info) => {
            if (error || !user) {
                return res.status(400).json({
                    message: 'User not found',
                    user: user
                });
            }
            req.login(user, { session: false }, (error) => {
                if (error) {
                    res.send(error);
                }
                var token = generateJWTToken(user.toJSON());
                return res.json({ user, token }); // ES6 shorthand if the keys are the same as the values
            });
        })(req, res);
    });
}