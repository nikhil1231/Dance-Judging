var express = require('express');
var router = express.Router();
var path = require('path');

const mongoClient = require('mongodb').MongoClient;
const mongoUrl = "mongodb://localhost:27017/dance";

router.get('/', (req, res) => {
    // console.log(__dirname);
    res.sendFile(path.resolve('www/index.html'));
    // res.render('index', {title: 'Hey', message: 'Hello there!'});
})

module.exports = router;
