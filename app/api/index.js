var jwt = require('jsonwebtoken');
var moment = require('moment');
var config = require('../config');
var User = require(__dirname + '/models/user');
var express = require('express');
var app = express();
var api = express.Router();
var _user = {};

// ---------------------------------------------------------
// authentication (no middleware necessary since this isnt authenticated)
// ---------------------------------------------------------

app.set('superSecret', config.secret);
app.set('expiresIn', config.expiresIn);

api.post('/authenticate', function(req, res) {
    if (typeof req.body.username == 'undefined' || typeof req.body.password == 'undefined') {
        res.json({ success: false, message: 'required fields not found' });
    } else {
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
                        expiresIn: app.get('expiresIn') // expires in 30 minutes
                    });

                    res.json({
                        success: true,
                        message: 'Success!',
                        accesstoken: token,
                        expiresIn: moment().add(app.get('expiresIn'), "seconds").unix(),
                        currentTime: moment().unix()
                    });
                }

            }

        });
    }
});

// ---------------------------------------------------------
// route middleware to authenticate and check token
// ---------------------------------------------------------
api.use(function(req, res, next) {

    // check header or url parameters or post parameters for token
    var token = req.body.token || req.params.token || req.headers['x-access-token'];

    // decode token
    if (token) {

        // verifies secret and checks exp
        jwt.verify(token, app.get('superSecret'), function(err, decoded) {
            if (err) {
                return res.json({ success: false, message: 'failed to authenticate token.', error: err });
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
api.get('/', function(req, res) {
    res.json({ message: 'Nothing to show here.' });
});

//endpoint used by web admin
api.route('/users')
    .get(function(req, res) {
        User.find({}, function(err, users) {
            res.json(users);
        });
    })
    .post(function(req, res) {
        var fields = ['password', 'username', 'firstname', 'lastname'];
        for (var i = fields.length - 1; i >= 0; i--) {
            if (!req.body.hasOwnProperty(fields[i])) {
                res.json({ success: false, message: 'required fields not found' });
            }
        }
        var user = new User({
            username: req.body.username,
            password: req.body.password,
            firstname: req.body.firstname,
            admin: false
        });
        user.save(function(err) {
            try {
                if (err) {
                    res.json({ success: false, message: "user already registered." });
                } else {
                    //create user
                    res.json({ success: true, message: 'user created!' });
                }
            } catch (ex) {
                res.json({ success: false, message: "user already registered" });
            }
        });
    });

api.param('userid', function(req, res, next, value) {
    User.findOne({
        _id: value
    }, function(err, user) {
        if (err) throw err;

        if (!user) {
            res.json({ success: false, message: 'User ID provided is invalid' });
        } else if (user) {
            _user = user;
            next(); //call on the next handler
        }
    });
});

api.route('/users/:userid')
    .get(function(req, res) {
        res.json({ user: _user });
    })
    .put(function(req, res) {
        //handles updates ONLY
        res.json({
            success: true,
            message: 'user updated',
            user_info: _user
        });
    })
    .delete(function(req, res) {
        res.json({ message: 'user deleted' });
    });

api.get('/check', function(req, res) {
    res.json(req.decoded);
});
api.post('/analytics', function(req, res) {
    res.json(req.body);
});

module.exports = api;
