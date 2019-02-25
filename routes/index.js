var express = require('express');
var router = express.Router();
var path = require('path');
var multer  = require('multer');

var storage = multer.diskStorage({
	destination: __dirname + '/../recordings',
	filename: (req, file, cb) => {
		cb(null, file.fieldname + '-' + Date.now() + ".json")
	}
})

var upload = multer({ storage })

const mongoClient = require('mongodb').MongoClient;
const mongoUrl = "mongodb://localhost:27017/dance";

router.get('/', (req, res) => {
    res.sendFile(path.resolve('www/index.html'));
})

router.post('/file', upload.single('data'), (req, res, next) => {
	console.log(req.file)
})

module.exports = router;
