var express = require('express');
var router = express.Router();
var path = require('path');

const mongoClient = require('mongodb').MongoClient;
const mongoUrl = "mongodb://localhost:27017/dance";

var NodeGeocoder = require('node-geocoder');

var options = {
    provider: 'google',
    httpAdapter: 'https',
    apiKey: process.env.GEOCODER_API_KEY,
    formatter: null
};

var geocoder = NodeGeocoder(options);

router.get('/', (req, res) => {
    // console.log('/', req.user);
    // res.sendFile(path.resolve('www/index.html'));
    res.render('index', {
        user: req.user
    });

})

router.get('/check', (req, res) => {
    geocoder.geocode("", function (err, data) {
        console.log(data);
        var latitude = data[0].latitude;
        var longitude = data[0].longitude;
        var location = data[0].formattedAddress;
        // res.render('googlemaptest2', {user:req.user});
        console.log("latitude", latitude);
        console.log("longitude", longitude);
        console.log("location", location);
        res.end("check");
    })
});


// router.get('/init', function(req, res){
//     mongoClient.connect(mongoUrl, (err, db) => {
//         if (err) {
//             console.log("ERROR: ", err);
//         } else {
//             const danceDb = db.db('dance');
//             const collection = danceDb.collection("events");

//         }
//     })

//     /*... skipping similar code for other test events...*/

//     res.send("Test events were added to the database")
// });

// router.get('/data', function(req, res){
//     mongoClient.connect(mongoUrl, (err, db) => {
// 		if (err) {
// 			console.log("ERROR: ", err);
// 		} else {
// 			const collection = db.db('dance').collection("events");

// 			collection.find({}).toArray((err, data) => {
// 				if (err) {
// 					res.send(err);
// 				} else if (data.length) {
// 					for (var i = 0; i < data.length; i++)
// 						data[i].id = data[i]._id;
// 					res.send(data);			
// 				} else {}
// 			})

// 			db.close();
// 		}
// 	})


module.exports = router;