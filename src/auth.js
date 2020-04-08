const passport = require('passport');
const generateJWTToken = require('./auth-jwt');
// require('./passport.js') // Local passport file

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