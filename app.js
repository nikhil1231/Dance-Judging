var fs = require('fs');
var http = require('http');
var https = require('https');
var formidable = require('formidable');
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

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/www/index.html')
})

app.post('/fileupload', (req, res) => {
	var form = new formidable.IncomingForm();
    form.parse(req, (err, fields, files) => {
    	const d = new Date();
    	// Create unique video file name.
    	const filename = d.getTime() + "_" + Math.floor((Math.random() * 9000) + 1000);
		const extension = files.filetoupload.name.split('.').pop();
		const oldpath = files.filetoupload.path;
		const newpath = __dirname + '/videos/' + filename + '.' + extension;
		fs.rename(oldpath, newpath, (err) => {
			if (err) throw err;
			res.write('Video successfully uploaded.');
			res.end();
		});
	})
})

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

httpServer.listen(8080);
httpsServer.listen(8443);