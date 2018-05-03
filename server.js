var express = require('express');
var app = express();
var path = require('path');
var port = process.env.PORT || 8080;

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
    res.sendFile(path.join(__dirname + '/semantic/dist/semantic.min.js'));
    res.sendFile(path.join(__dirname + '/semantic/dist/semantic.min.css'));   
});

app.listen(port);
