var express = require('express');
var router = express.Router();
var path = require('path');
const url = require('url');


const mongoClient = require('mongodb').MongoClient;
const mongoUrl = "mongodb://localhost:27017/dance";


router.get('/', (req, res) => {
	// res.sendFile(path.resolve('www/judge.html'));
	res.render('judge', {user:req.user});
})

router.get('/getInfo', (req, res) => {
	mongoClient.connect(mongoUrl, (err, db) => {
		if (err) {
			console.log("ERROR: ", err);
		} else {
			const collection = db.db('dance').collection("competitions");

			const id = url.parse(req.url, true).query.id;

			collection.find({"routines.id": id}).toArray((err, result) => {
				if (err) {
					res.send(err);
				} else if (result.length) {
					const data = {
						competition: result[0].competition,
						location: result[0].location,
						routine: result[0].routines.filter((x) => x.id == id)[0]
					}
					res.send(data);
				} else {
					res.send("No documents found.");
				}
			})

			db.close();
		}
	})
})

router.post('/addResult', (req, res) => {
	mongoClient.connect(mongoUrl, (err, db) => {
		if (err) {
			console.log("ERROR: ", err);
		} else {
			const collection = db.db('dance').collection("competitions");
			const id = req.body.id;
			const rating = req.body.rating;
			const comment = req.body.comment;

			collection.updateOne({"routines.id": id},
				{ $push : {
					"routines.$.results" : {
						rating,
						comment
					}
				}}
			)

			res.end();
			db.close();
		}
	})
})


module.exports = router;
