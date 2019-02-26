var express = require('express');
var router = express.Router();
var path = require('path');
var formidable = require('formidable');
var fs = require('fs');


const mongoClient = require('mongodb').MongoClient;
const mongoUrl = "mongodb://localhost:27017/dance";


router.get('/', (req, res) => {
    // console.log(__dirname);
    res.sendFile(path.resolve('www/upload.html'));
    // res.end('egoing: '+ req.url);
})

router.post('/fileupload', (req, res) => {
  // console.log("check" + req.body);
  // console.log("check2");
	var form = new formidable.IncomingForm();
    form.parse(req, (err, fields, files) => {
      // console.log("check2 :" + fields.competition);
    	const d = new Date();
    	// Create unique video file name.
    	const filename = d.getTime() + "_" + Math.floor((Math.random() * 9000) + 1000);
  		const extension = files.filetoupload.name.split('.').pop();
      // console.log("Test!!");
		const oldpath = files.filetoupload.path;
		const newpath = __dirname + '/../videos/' + filename + '.' + extension;
    	// Move video to new path

    	// console.log(oldpath, newpath)
	// 	fs.rename(oldpath, newpath, (err) => {
	// 		if (err) throw err;
	// 		// res.write('Video successfully uploaded.');
	// });

  console.log(fields)

    // res.writeHead(200);
    // res.end("test");

    mongoClient.connect(mongoUrl, (err, db) => {
			if (err) {
				console.log("ERROR: ", err);
			} else {
				const danceDb = db.db('dance');
				const collection = danceDb.collection("competitions");

				collection.findOneAndUpdate({dance: { $eq: fields.dance}},
					{
						$setOnInsert: {
							routines: []
						}
					},
					{
						returnNewDocument: true,
						upsert: true
					}, (err, result) => {
						collection.update(
							{dance: { $eq: fields.dance}},
							{
								$push: {
									routines: {
										id: filename,
										name: fields.name,
                    location: fields.location,
										competition: fields.competition,
										results: []
									}
								}
							}, (err, result) => {
                var template = `
                <html>
                <head>
                </head>
                <body>
                <h1>Video URL: <a href='../judge?id=${filename}'>here</a></h1>
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
