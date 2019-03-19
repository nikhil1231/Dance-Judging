var express = require('express');
var router = express.Router();
var path = require('path');
// var multer  = require('multer');

// var storage = multer.diskStorage({
// 	destination: __dirname + '/../recordings',
// 	filename: (req, file, cb) => {
// 		cb(null, file.fieldname + '-' + Date.now() + ".json")
// 	}
// })

// var upload = multer({ storage })


router.get('/', (req, res) => {
    // console.log('/', req.user);
    // res.sendFile(path.resolve('www/index.html'));
    res.render('index', {user:req.user});

})

router.get('/calendar', (req, res) => {
    // console.log('/', req.user);
    // res.sendFile(path.resolve('www/index.html'));
    res.render('calendar', {});

})

module.exports = router;
