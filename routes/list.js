var express = require('express');
var router = express.Router();
var path = require('path');
const url = require('url');

const ObjectId = require('mongodb').ObjectId;
const mongoClient = require('mongodb').MongoClient;
const mongoUrl = "mongodb://localhost:27017/dance";


router.get('/', (req, res) => {
	mongoClient.connect(mongoUrl, (err, db) => {
		if (err) {
			console.log("ERROR: ", err);
		} else {
			const collection = db.db('dance').collection("events");

			collection.find({}).toArray((err, result) => {
				if (err) {
					res.send(err);
				} else if (result.length) {
					for (var i = 0; i < result.length; i++)
						result[i].id = result[i]._id;
				} else {}
			})

			db.close();
		}
	})
		res.render('list', {
			user: req.user
		});
})

// router.get('/comp/:compId/getRoutines',(req, res) => {
// 	mongoClient.connect(mongoUrl, (err, db) => {
// 		if (err) {
// 			console.log("ERROR: ", err);
// 		} else {
// 			const collection = db.db('dance').collection("competitions");

// 			const id = new ObjectId(url.parse(req.url, true).query.id);
// 			// console.log(url.parse(req.url, true).query.id);
// 			// console.log("haha");
// 			collection.find({
// 				_id: id
// 			}).toArray((err, result) => {
// 				if (err) {
// 					res.send(err);
// 				} else if (result.length) {
// 					res.send(result[0].routines);
// 				} else {
// 					res.send("No documents found.");
// 				}
// 			})

// 			db.close();
// 		}
// 	})
// })

router.get('/comp/:compId.:uploadType', (req, res) => {
	var compData = {};
	var danceData = {dance:[], id:[]};

	mongoClient.connect(mongoUrl, (err, db) => {
		if (err) {
			console.log("ERROR: ", err);
		} else {
			const uploadType = req.params.uploadType;
			const collection = db.db('dance').collection(uploadType == "video" ? "competitions" : "competitions_kinect");

			const id = req.params.compId
			console.log(req.params.compId);


			collection.find({"competition_id": id}).toArray((err, result) => {
				if (err) {
					res.send(err);
				} else if (result.length) {
					// console.log(result)
					compData.competition_id = id;
					compData.competition = result[0].competition;
					compData.location = result[0].location;
					compData.latitude = result[0].latitude;
					compData.longitude = result[0].longitude;
					for (var i=0; i<result[0].routines.length;i++){
						danceData.dance.push(result[0].routines[i].dance);
						danceData.id.push(result[0].routines[i].id);
					}
					// danceData.dance = result[0].routines[0].dance;
					// danceData.id = result[0].routines[0].id;

					console.log(danceData);
					res.render('competition', {
						user: req.user,
						compData: compData,
						danceData: danceData
					});
					
					// console.log("check : "+compData.competition);
						// routine: result[0].routines.filter((x) => x.id == id)[0]	
					// res.send(data);
					
				} else {
					console.log(result);
					res.send("No documents found.");
				}
			})
			// console.log("check : "+compData.competition);
			// res.render('competition', {
			// 	user: req.user,
			// 	compData: compData,
			// });
			db.close();
		}
	})
});

router.get('/getCompetitions/:uploadType', (req, res) => {
	const competitions_locations = [];
	mongoClient.connect(mongoUrl, (err, db) => {
		if (err) {
			console.log("ERROR: ", err);
		} else {
			const uploadType = req.params.uploadType;
			const collection = db.db('dance').collection(uploadType == "video" ? "competitions" : "competitions_kinect");

			collection.find({}).toArray((err, result) => {
				if (err) {
					res.send(err);
				} else if (result.length) {
					result.forEach((x) => {
						delete x.routines
						competitions_locations.push({
							longitude: x.longitude,
							latitude: x.latitude
						})
					})
					console.log(competitions_locations)
					// res.render('list', {
					// 	result,
					// 	competitions_locations,
					// });

					res.send({
						result, competitions_locations
					})
				} else {
					res.send("No documents found.");
				}
			})

			db.close();
		}
	})

})

router.get('/getRoutines/:id.:uploadType', (req, res) => {
	mongoClient.connect(mongoUrl, (err, db) => {
		if (err) {
			console.log("ERROR: ", err);
		} else {
			const uploadType = req.params.uploadType;
			const collection = db.db('dance').collection(uploadType == "video" ? "competitions" : "competitions_kinect");

			const id = req.params.id;

			console.log(id, uploadType)
			collection.find().toArray((err, result) => console.log(result));
			
			// collection.find({
			// 	_id: id
			// }).toArray((err, result) => {
			// 	console.log("result");
			// 	if (err) {
			// 		res.send(err);
			// 	} else if (result.length) {
			// 		res.send(result[0].routines);
			// 	} else {
			// 		res.send("No documents found.");
			// 	}
			// })

			db.close();
		}
	})
})



module.exports = router;