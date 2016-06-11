var express = require('express');
var webapp = express.Router();


webapp.get('/admin', function(req, res) {
    res.send('admin');
});

webapp.get('/', function(req, res) {
    res.render(__dirname + "/views/index");
});

webapp.get('/partials/:name', function(req, res) {
    var name = req.params.name;
    res.render(__dirname + "/views/partials/" + name);
});
module.exports = webapp;
