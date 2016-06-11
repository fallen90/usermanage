
var express = require('express');
var compression = require('compression');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var _ = require('lodash');
var fs = require('fs');
var config = require('./config');

var port = process.env.PORT || 8080;
mongoose.connect(config.database); 


app.disable('x-powered-by');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(compression());
app.use(morgan('combined', { stream: fs.createWriteStream(__dirname + '/../access.log', { flags: 'a' }) }));


app.set('view engine', 'jade');


app.use('/', require('./webapp'));
app.use('/api', require('./api'));

app.use('/lib', express.static(__dirname + "/webapp/dist"));
app.use('/app', express.static(__dirname + "/webapp/js"));

// =================================================================
// start the server ================================================
// =================================================================
app.listen(port);
console.log('Server started. [0.0.0.0:' + port +']');


process.on('uncaughtException', function(err) {
    // handle the error safely
    console.log(err)
});
