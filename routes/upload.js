var express = require('express');
var router = express.Router();
var formidable = require('formidable');

const mongoClient = require('mongodb').MongoClient;
const mongoUrl = "mongodb://localhost:27017/dance";


router.get('/', (req, res) => {
		if(!req.user) {
			return res.redirect('/auth/login');
			// return res.render('index', {user:req.user, loginCheck:true});
		}
		res.render('upload', {user:req.user});
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

				collection.findOneAndUpdate({competition: { $eq: fields.competition}},
					{
						$setOnInsert: {
							location: fields.location,
							routines: []
						}
					},
					{
						returnNewDocument: true,
						upsert: true
					}, (err, result) => {
						collection.update(
							{competition: { $eq: fields.competition}},
							{
								$push: {
									routines: {
										id: filename,
										name: fields.name,
										location: fields.location,
										dance: fields.dance,
										results: []
									}
								}
							}, (err, result) => {
								res.redirect('/judge?id=${filename}');
							}
						)
					}
				)

			}
		})
	})
})


module.exports = router;
