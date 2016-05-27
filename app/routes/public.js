module.exports = (function() {
    'use strict';
    var router = require('express').Router();

    router.get('/', function(req, res) {
        res.send('Hello! The API is at /api');
    });

    router.get('/admin', function(req, res) {

        // create a sample user
        var nick = new User({
            username: 'xxxx',
            password: 'password',
            admin: true
        });
        nick.save(function(err) {
            try {
                if (err)
                    res.json({ success: false, message: "Duplicate" });

                console.log('User saved successfully');
                res.json({ success: true });
            } catch (ex) {
                res.json({ success: false, message: "Duplicate" });
            }
        });
    });


    return router;
})();
