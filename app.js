const fs = require('fs');
const http = require('http');
const https = require('https');
const url = require('url');
const formidable = require('formidable');
const privateKey  = fs.readFileSync('server.key', 'utf8');
const certificate = fs.readFileSync('server.crt', 'utf8');
const credentials = {key: privateKey, cert: certificate};

const mongoClient = require('mongodb').MongoClient;

const express = require('express');
const app = express();

const mongoUrl = "mongodb://localhost:27017/dance";


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
		// Move video to new path
		fs.rename(oldpath, newpath, (err) => {
			if (err) throw err;
			// res.write('Video successfully uploaded.');
		});

		mongoClient.connect(mongoUrl, (err, db) => {
			if (err) {
				console.log("ERROR: ", err);
			} else {
				const danceDb = db.db('dance');
				const collection = danceDb.collection("competitions");

				collection.findOneAndUpdate({competition: { $eq: fields.competition}},
					{
						$setOnInsert: {
							location: fields.location,
							routines: []
						}
					},
					{
						new: true,
						upsert: true
					}, (err, result) => {
						collection.update(
							{competition: { $eq: fields.competition}},
							{
								$push: {
									routines: {
										id: filename,
										name: fields.name,
										dance: fields.dance,
										results: []
									}
								}
							}, (err, result) => {
								res.write('<html><head></head><body>')
								res.write(`<h1>Video URL: <a href='/judge?id=${filename}'>here</a></h1>`)
								res.write('</body></html>')
								res.end();
							}
						)
					}
				)

			} 
		})
	})
})


app.get('/judge', (req, res) => {
	mongoClient.connect(mongoUrl, (err, db) => {
		if (err) {
			console.log("ERROR: ", err);
		} else {
			const danceDb = db.db('dance');
			const collection = danceDb.collection("competitions");

			const id = url.parse(req.url, true).query.id;

			collection.find({"routines.id": id}).toArray((err, result) => {
				if (err) {
					res.send(err);
				} else if (result.length) {
					res.send(result);
				} else {
					res.send("No documents found.");
				}
			})

			db.close();
		} 
	})
})

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

httpServer.listen(8080);
httpsServer.listen(8443);