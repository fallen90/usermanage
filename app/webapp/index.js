var webapp = require('express').Router();

webapp.get('/admin', function(req, res) {
    res.send('admin');
});

webapp.get('/', function(req, res) {
    res.send('WEB APP');
});

module.exports = webapp;