var express = require('express');
var router = express.Router();
var path = require('path');
var formidable = require('formidable');
var fs = require('fs');
const shortid = require('shortid');

module.exports = function (passport) {
	const mongoClient = require('mongodb').MongoClient;
	const mongoUrl = "mongodb://localhost:27017/users";

	router.get('/register', function (req, res) {
		res.sendFile(path.resolve('www/register.html'));
	});

	router.post('/register_process', function (req, res) {
		var post = req.body;
		// console.log(post);
		var email = post.email;
		var pwd = post.pwd;
		var pwd2 = post.pwd2;
		var userName = post.userName;

		if (pwd !== pwd2) {
			req.flash('error', 'Passwords must be the same!');
			res.redirect('/auth/register');
		} else {
			mongoClient.connect(mongoUrl, (err, db) => {
				if (err) {
					console.log("ERROR: ", err);
				} else {
					const danceDb = db.db('users');
					const collection = danceDb.collection("identities");
					var user = {
						_id: shortid.generate(),
						email: email,
						password: pwd,
						userName: userName,
					}
					collection.insertOne(user)
				}
			})
		}
		res.redirect('/auth/login');
		// console.log(user);
		// req.login(user, function(err) {
		// 	return res.redirect('/');
		// })
	});

	router.get('/login', function (req, res) {
		// var fmsg = req.flash();
		// console.log(fmsg);
		// if(fmsg){
		// 	req.flash();
		// }
		res.sendFile(path.resolve('www/login.html'));
	});

	router.post('/login_process',
		passport.authenticate('local', {
			successRedirect: '/',
			failureRedirect: '/auth/login',
			failureFlash: true,
			successFlash: true
		}));
		return router;
}