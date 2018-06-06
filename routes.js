// Route Module.
var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/index.html'));
});

router.get('/candidates', function(req, res, next) {
    ref.once("value", function(snapshot) {
        res.json(snapshot.val());
    });  
});

router.get('/checkip/*', function(req, res, next) {
    ref.once("value", function(snapshot) {
        res.json(snapshot.val());
    });  
});

module.exports = router;