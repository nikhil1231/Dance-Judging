router.get('/getRoutines', (req, res) => {
	mongoClient.connect(mongoUrl, (err, db) => {
		if (err) {
			console.log("ERROR: ", err);
		} else {
			const collection = db.db('dance').collection("competitions");

			const id = new ObjectId(url.parse(req.url, true).query.id);
			// console.log(url.parse(req.url, true).query.id);
			// console.log("haha");
			collection.find({
				_id: id
			}).toArray((err, result) => {
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
