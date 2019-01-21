var express = require('express');
var router = express.Router();
var path = require('path');
var formidable = require('formidable');
var fs = require('fs');

// var MongoClient = require('mongodb').MongoClient;
// var url = "mongodb://localhost:27017/mydb";


router.get('/', (req, res) => {
    // console.log(__dirname);
    res.sendFile(path.resolve('www/upload.html'));
    // res.end('egoing: '+ req.url);
})

router.post('/fileupload', (req, res) => {
	var form = new formidable.IncomingForm();
    form.parse(req, (err, fields, files) => {
    	const d = new Date();
    	// Create unique video file name.
    	const filename = d.getTime() + "_" + Math.floor((Math.random() * 9000) + 1000);
      // const test = files.filetoupload.name
      // console.log("filename: " + filename);
      // console.log("check:" + test);
  		const extension = files.filetoupload.name.split('.').pop();
      console.log(files.filetoupload);
		const oldpath = files.filetoupload.path;
		const newpath = __dirname + '/videos/' + filename + '.' + extension;
    console.log(oldpath);
    console.log(newpath);

    res.writeHead(200);
    res.end("test");

    MongoClient.connect(url, function(err, db){
      if (err) throw err;
      var dbo = db.db("mydb");
      var myobj = { filename: `${filename}`};
      dbo.collection("videos").insertOne(myobj, function(err, res) {
        if (err) throw err;
        console.log("1 document inserted");
        db.close();
      });
    });

		// fs.rename(oldpath, newpath, (err) => {
		// 	if (err) throw err;
		// 	// res.write('Video successfully uploaded.');
		// 	res.end();
		// });
	})
})

module.exports = router;
