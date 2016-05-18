var express = require('express');
var app = express();

var port = 8080;

var info = {
  ipaddress: '',
  language: '',
  software: ''
};

//initial request
app.get('/', function(req, res, next) {
  next();
});

//IP middleware
app.use(function(req, res, next) {
    info.ipaddress = req.headers['x-forwarded-for'] || 
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connect.socket.remoteAddress;
    next();
});


//language middleware
app.use(function(req, res, next) {
  info.language = req.headers['accept-language'].split(',')[0];
  next();
});

//software middleware
app.use(function(req, res, next) {
  var reg = /\(([^)]+)\)/;
  info.software = req.headers['user-agent'].split(reg)[1];
  next();
});


//send
app.use(function(req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end(JSON.stringify(info));
});

app.listen(port);