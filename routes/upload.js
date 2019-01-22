var express = require('express');
var router = express.Router();
var path = require('path');
var formidable = require('formidable');
var fs = require('fs');
const url = require('url');


const mongoClient = require('mongodb').MongoClient;
const mongoUrl = "mongodb://localhost:27017/dance";


router.get('/', (req, res) => {
    // console.log(__dirname);
    res.sendFile(path.resolve('www/upload.html'));
    // res.end('egoing: '+ req.url);
})

router.get('/judge', (req, res) => {
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

router.post('/fileupload', (req, res) => {
	var form = new formidable.IncomingForm();
    form.parse(req, (err, fields, files) => {
    	const d = new Date();
    	// Create unique video file name.
    	const filename = d.getTime() + "_" + Math.floor((Math.random() * 9000) + 1000);
  		const extension = files.filetoupload.name.split('.').pop();
		const oldpath = files.filetoupload.path;
		const newpath = __dirname + '/videos/' + filename + '.' + extension;
    // Move video to new path
		// fs.rename(oldpath, newpath, (err) => {
		// 	if (err) throw err;
		// 	// res.write('Video successfully uploaded.');
		// });


    // res.writeHead(200);
    // res.end("test");

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
                var template = `
                <html>
                <head>
                </head>
                <body>
                <h1>Video URL: <a href='upload/judge?id=${filename}'>here</a></h1>
                </body>
                </html>
                `;
								res.write(template);
								res.end();
							}
						)
					}
				)

			}
		})
	})
})


module.exports = router;
