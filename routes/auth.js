var express = require('express');
var router = express.Router();
var path = require('path');
var formidable = require('formidable');
var fs = require('fs');
const shortid = require('shortid');
const bcrypt = require('bcrypt');

module.exports = function (passport) {
	const mongoClient = require('mongodb').MongoClient;
	const mongoUrl = "mongodb://localhost:27017/users";

	router.get('/register', function (req, res) {
		// res.sendFile(path.resolve('www/register.html'));
		res.render('register', {});
	});

	router.post('/register_process', function (req, res) {
		var post = req.body;
		// console.log(post);
		var email = post.email;
		var pwd = post.pwd;
		var pwd2 = post.pwd2;
		var userName = post.userName;

		if (pwd !== pwd2) {
			var test = req.flash('error', 'Passwords must be the same!');
			// res.render('register', {errors : test});
			res.redirect('/auth/register');
		} else {
			bcrypt.hash(pwd, 10, function(err, hash) {
				mongoClient.connect(mongoUrl, (err, db) => {
					if (err) {
						console.log("ERROR: ", err);
					} else {
						const danceDb = db.db('users');
						const collection = danceDb.collection("identities");
						var user = {
							_id: shortid.generate(),
							email: email,
							password: hash,
							userName: userName,
						}
						collection.insertOne(user)
					}
				})
			  });
		}
		res.redirect('/auth/login');
	});

	router.get('/login', function (req, res) {
		res.render('login', {});
	});

	router.post('/login_process',
		passport.authenticate('local', {
			successRedirect: '/',
			failureRedirect: '/auth/login',
			failureFlash: true,
			successFlash: true
		}));
	router.get('/logout', function (req, res) {
		req.logout();
		res.redirect('/');
	});
		
	return router;
}