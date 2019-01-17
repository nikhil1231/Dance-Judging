var fs = require('fs');
var http = require('http');
var https = require('https');
var privateKey  = fs.readFileSync('server.key', 'utf8');
var certificate = fs.readFileSync('server.crt', 'utf8');
var MongoClient = require('mongodb').MongoClient;

var credentials = {key: privateKey, cert: certificate};
var express = require('express');
var app = express();

var url = "mongodb://localhost:27017/mydb";

// MongoClient.connect(url, function(err, db) {
//   if (err) throw err;
//   console.log("Database created!");
//   db.close();
// });

app.get("/", function(req, res) {
	console.log("successful test")
	res.sendFile(__dirname + "/www/index.html")
})

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

httpServer.listen(8080);
httpsServer.listen(8443);