const jwtSecret = 'your_jwt_secret'; // Same key used in jwtStrategy
const jwt = require('jsonwebtoken');

module.exports = function generateJWTToken(user) {
    return jwt.sign(user, jwtSecret, {
        subject: user.Username, // Username you are encoding
        expiresIn: '7d', // Durationg of token
        algorithm: 'HS256' // Encoding the values of the JWT
    });
}