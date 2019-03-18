var express = require('express');
var router = express.Router();
var path = require('path');
const url = require('url');

const ObjectId = require('mongodb').ObjectId;
const mongoClient = require('mongodb').MongoClient;
const mongoUrl = "mongodb://localhost:27017/dance";


router.get('/', (req, res) => {
		// res.sendFile(path.resolve('www/list.html'));
		res.render('list', {user:req.user});
})

router.get('/getCompetitions', (req, res) => {
	mongoClient.connect(mongoUrl, (err, db) => {
		if (err) {
			console.log("ERROR: ", err);
		} else {
			const collection = db.db('dance').collection("competitions");

			collection.find({}).toArray((err, result) => {
				if (err) {
					res.send(err);
				} else if (result.length) {
					result.forEach((x) => delete x.routines)
					res.send(result);
				} else {
					res.send("No documents found.");
				}
			})

			db.close();
		}
	})
})

router.get('/getDances', (req, res) => {
	mongoClient.connect(mongoUrl, (err, db) => {
		if (err) {
			console.log("ERROR: ", err);
		} else {
			const collection = db.db('dance').collection("competitions");

			collection.find({}).toArray((err, result) => {
				if (err) {
					res.send(err);
				} else if (result.length) {
					result.forEach((x) => delete x.routines)
					res.send(result);
				} else {
					res.send("No documents found.");
				}
			})

			db.close();
		}
	})
})

router.get('/getRoutines', (req, res) => {
	mongoClient.connect(mongoUrl, (err, db) => {
		if (err) {
			console.log("ERROR: ", err);
		} else {
			const collection = db.db('dance').collection("competitions");

			const id = new ObjectId(url.parse(req.url, true).query.id);
      // console.log(url.parse(req.url, true).query.id);
      // console.log("haha");


			collection.find({_id: id}).toArray((err, result) => {
				if (err) {
					res.send(err);
				} else if (result.length) {
					res.send(result[0].routines);
				} else {
					res.send("No documents found.");
				}
			})

			db.close();
		}
	})
})



module.exports = router;
