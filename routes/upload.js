var express = require('express');
var router = express.Router();
var formidable = require('formidable');
var path = require('path');
var fs = require('fs');
const shortid = require('shortid');
var NodeGeocoder = require('node-geocoder');

var options = {
	provider: 'google',
	httpAdapter: 'https',
	apiKey: process.env.GEOCODER_API_KEY,
	formatter: null
};

var geocoder = NodeGeocoder(options);

var multer  = require('multer');

var storage = multer.diskStorage({
	destination: __dirname + '/../recordings',
	filename: (req, file, cb) => {
		const d = new Date();
		cb(null, d.getTime() + "_" + Math.floor((Math.random() * 9000) + 1000) + ".json")
	}
})

var upload = multer({ storage })

const mongoClient = require('mongodb').MongoClient;
const mongoUrl = "mongodb://localhost:27017/dance";


router.get('/', (req, res) => {
	if (!req.user) {
		return res.redirect('/auth/login');
		// return res.render('index', {user:req.user, loginCheck:true});
	}
	res.render('upload', {
		user: req.user
	});
})

router.post('/jsonupload', upload.single('data'), (req, res, next) => {
	console.log("Uploaded " + req.file);
	let rawdata = fs.readFileSync('recordings/' + req.file.filename);  
	let data = JSON.parse(rawdata);

	createDance(res,{
		location: "8 alleyn park",
		competition: data.competition,
		date: "2019-04-12",
		time: "04:20",
		name: data.name,
		dance: data.dance
	}, req.file.filename.split('.')[0], true);
})

router.post('/fileupload', (req, res) => {

	var form = new formidable.IncomingForm();
	form.parse(req, (err, fields, files) => {

		console.log(fields);
		const d = new Date();
		// Create unique video file name.
		const filename = d.getTime() + "_" + Math.floor((Math.random() * 9000) + 1000);
		const extension = files.fileUpload.name.split('.').pop();
		const oldpath = files.fileUpload.path;
		const newpath = __dirname + '/../videos/' + filename + '.' + extension;

		fs.rename(oldpath, newpath, (err) => {
			if (err) throw err;
		});

		createDance(res, fields, filename);
	})
})

function createDance(res, fields, filename, kinect=false) {
	mongoClient.connect(mongoUrl, (err, db) => {
		if (err) {
			console.log("ERROR: ", err);
		} else {
			const danceDb = db.db('dance');
			const collection = kinect ? danceDb.collection("competitions_kinect") : danceDb.collection("competitions");

			geocoder.geocode(fields.location, function (err, data) {
				console.log(err)
				console.log(data)
				var latitude = data[0].latitude;
				var longitude = data[0].longitude;
				var location = data[0].formattedAddress;

				collection.findOneAndUpdate({
					competition: {
						$eq: fields.competition
					}
				}, {
					$setOnInsert: {
						competition_id: shortid.generate(),
						location: location,
						latitude: latitude,
						longitude: longitude,
						routines: []
					}
				}, {
					returnNewDocument: true,
					upsert: true
				}, (err, result) => {
					collection.update({
						competition: {
							$eq: fields.competition
						}
					}, {
						$push: {
							routines: {
								id: filename,
								name: fields.name,
								location: fields.location,
								dance: fields.dance,
								date: fields.date,
								time: fields.time,
								results: []
							}
						}
					}, (err, result) => {
						//   mongoClient.connect(mongoUrl, (err, db) => {
						// 	  if (err) {
						// 		  console.log("ERROR: ", err);
						// 	  } else {
						// 		  const danceDb = db.db('dance');
						// 		  const collection = danceDb.collection("events");

						// 		  collection.insert({
						// 			  text: fields.competition,
						// 			  start_date: new Date(fields.date),
						// 			  end_date: new Date(fields.date)
						// 		  });
						// 	  }
						//   })
						//   mongoClient.connect(mongoUrl, (err, db) => {
						// 	  if (err) {
						// 		  console.log("ERROR: ", err);
						// 	  } else {
						// 		  const collection = db.db('dance').collection("events");

						// 		  collection.find({}).toArray((err, result) => {
						// 			  if (err) {
						// 				  res.send(err);
						// 			  } else if (result.length) {
						// 				  for (var i = 0; i < result.length; i++)
						// 					  result[i].id = result[i]._id;
						// 			  } else {}
						// 		  })

						// 		  db.close();
						// 	  }
						//   })
						res.redirect(`/judge?id=${filename}`);
					})
				})
			});
		}
	})
}


module.exports = router;