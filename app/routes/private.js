module.exports = (function() {
    'use strict';
    // ---------------------------------------------------------
    // get an instance of the router for api routes
    // ---------------------------------------------------------
    var apiRoutes = require('express').Router();

    // ---------------------------------------------------------
    // authentication (no middleware necessary since this isnt authenticated)
    // ---------------------------------------------------------
    // http://localhost:8080/api/authenticate
    apiRoutes.post('/authenticate', function(req, res) {

        // find the user
        User.findOne({
            username: req.body.username
        }, function(err, user) {

            if (err) throw err;

            if (!user) {
                res.json({ success: false, message: 'Authentication failed. User not found.' });
            } else if (user) {

                // check if password matches
                if (user.password != req.body.password) {
                    res.json({ success: false, message: 'Authentication failed. Wrong password.' });
                } else {

                    // if user is found and password is right
                    // create a token
                    var token = jwt.sign(user, app.get('superSecret'), {
                        expiresIn: 86400 // expires in 24 hours
                    });

                    res.json({
                        success: true,
                        message: 'Success!',
                        token: token
                    });
                }

            }

        });
    });

    // ---------------------------------------------------------
    // route middleware to authenticate and check token
    // ---------------------------------------------------------
    apiRoutes.use(function(req, res, next) {

        // check header or url parameters or post parameters for token
        var token = req.body.token || req.param('token') || req.headers['x-access-token'];

        // decode token
        if (token) {

            // verifies secret and checks exp
            jwt.verify(token, app.get('superSecret'), function(err, decoded) {
                if (err) {
                    return res.json({ success: false, message: 'failed to authenticate token.' });
                } else {
                    // if everything is good, save to request for use in other routes
                    req.decoded = decoded;
                    next();
                }
            });

        } else {

            // if there is no token
            // return an error
            return res.status(403).send({
                success: false,
                message: 'No token provided.'
            });

        }

    });

    // ---------------------------------------------------------
    // authenticated routes
    // ---------------------------------------------------------
    apiRoutes.get('/', function(req, res) {
        res.json({ message: 'Welcome to the coolest API on earth!' });
    });

    apiRoutes.get('/users', function(req, res) {
        User.find({}, function(err, users) {
            res.json(users);
        });
    });

    apiRoutes.get('/check', function(req, res) {
        res.json(req.decoded);
    });

    return apiRoutes;
});