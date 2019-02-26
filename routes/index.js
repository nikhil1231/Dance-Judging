var express = require('express');
var router = express.Router();
var path = require('path');

const mongoClient = require('mongodb').MongoClient;
const mongoUrl = "mongodb://localhost:27017/dance";

router.get('/', (req, res) => {
    res.sendFile(path.resolve('www/index.html'));
    // res.render('index', {});
    // res.send("Hello world!")
})

module.exports = router;
