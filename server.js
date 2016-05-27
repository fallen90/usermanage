// =================================================================
// get the packages we need ========================================
// =================================================================
var express = require('express');
var compression = require('compression');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var _ = require('lodash');
var fs = require('fs');
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var moment = require('moment');
var config = require('./config'); // get our config file
var User = require('./app/models/user'); // get our mongoose model

// =================================================================
// configuration ===================================================
// =================================================================
var port = process.env.PORT || 8080; // used to create, sign, and verify tokens
mongoose.connect(config.database); // connect to database

app.set('superSecret', config.secret); // secret variable
app.set('expiresIn', config.expiresIn); //expiresIn for tokens
app.disable('x-powered-by'); //remove x-powered-by header
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(compression()); //use compressions for all requests
// create a write stream (in append mode) 
var accessLogStream = fs.createWriteStream(__dirname + '/access.log', {flags: 'a'});
// setup the logger 
app.use(morgan('combined', {stream: accessLogStream}));
// =================================================================
// routes ==========================================================
// =================================================================
app.get('/admin', function(req, res) {
    try {
        // create a sample user
        var nick = new User({
            username: 'xxxx',
            password: 'password',
            admin: true
        });
        nick.save(function(err) {
           
                if (err) {
                    res.json({ success: false, message: "user already registered." });
                } else {
                    console.log('User saved successfully');
                    res.json({ success: true });
                }
            
        });
    } catch (ex) {
        res.json({ success: false, message: "an error occured", error: ex });
    }
});

// basic route (http://localhost:8080)
app.get('/', function(req, res) {
    res.send('Hello! The API is at http://localhost:' + port + '/api');
});

// ---------------------------------------------------------
// get an instance of the router for api routes
// ---------------------------------------------------------
var apiRoutes = express.Router();

// ---------------------------------------------------------
// authentication (no middleware necessary since this isnt authenticated)
// ---------------------------------------------------------
// http://localhost:8080/api/authenticate
apiRoutes.post('/authenticate', function(req, res) {
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
                        currentTime:moment().unix()
                    });
                }

            }

        });
    }
});

// ---------------------------------------------------------
// route middleware to authenticate and check token
// ---------------------------------------------------------
apiRoutes.use(function(req, res, next) {

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
apiRoutes.get('/', function(req, res) {
    res.json({ message: 'Welcome to the coolest API on earth!' });
});

apiRoutes.post('/create', function(req, res) {
    var fields = ['password', 'username', 'firstname', 'lastname', 'admin'];
    for (var i = fields.length - 1; i >= 0; i--) {
        if (!req.body.hasOwnProperty(fields[i])) {
            res.json({ success: false, message: 'required fields not found' });
        }
    }
    // var user = new User({
    //     username: req.body.username,
    //     password: req.body.password,
    //     firstname: req.body.firstname,
    //     admin: false
    // });
    // user.save(function(err) {
    //     try {
    //         if (err) {
    //             res.json({ success: false, message: "user already registered." });
    //         } else {
    //             //create user
    //             res.json({ success: true, message: 'user created!' });
    //         }
    //     } catch (ex) {
    //         res.json({ success: false, message: "user already registered" });
    //     }
    // });
});
apiRoutes.get('/users', function(req, res) {
    User.find({}, function(err, users) {
        res.json(users);
    });
});
//get user info
apiRoutes.get('/users/:userid', function(req, res){
    User.find({ id : req.params.userid }, function(err, users){
        res.json(users);
    });
});
apiRoutes.delete('/users/:userid', function(req, res){
    
});
apiRoutes.get('/check', function(req, res) {
    res.json(req.decoded);
});

app.use('/api', apiRoutes);

// =================================================================
// start the server ================================================
// =================================================================
app.listen(port);
console.log('Magic happens at http://0.0.0.0:' + port);


process.on('uncaughtException', function(err) {
    // handle the error safely
    console.log(err)
});