const bcrypt = require('bcrypt');

module.exports = function (app) {
    const mongoClient = require('mongodb').MongoClient;
    const mongoUrl = "mongodb://localhost:27017/users";

    var passport = require('passport'),
        LocalStrategy = require('passport-local').Strategy;

    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser(function (user, done) {
        console.log('serializeUser', user);
        done(null, user._id);
    });

    passport.deserializeUser(function (id, done) {
        mongoClient.connect(mongoUrl, (err, db) => {
            if (err) {
                console.log("ERROR: ", err);
            } else {
                const userDb = db.db('users');
                const collection = userDb.collection("identities");
                // console.log(username);
                // console.log(password);
                collection.findOne({
                    _id: {
                        $eq: id
                    }
                }, function (err, user) {
                    console.log('deserializeUser', id, user);

                    done(err, user);
                });
            }
        })
    });

    passport.use(new LocalStrategy({
            usernameField: 'email',
            passwordField: 'pwd'
        },
        function (email, password, done) {
            console.log('LocalStrategy', email, password);
            mongoClient.connect(mongoUrl, (err, db) => {
                if (err) {
                    console.log("ERROR: ", err);
                } else {
                    const userDb = db.db('users');
                    const collection = userDb.collection("identities");
                    // console.log(email);
                    // console.log(password);
                    collection.findOne({
                        email: {
                            $eq: email
                        }
                    }, function (err, user) {
                        // console.log('user password', user.password);
                        if (err) {
                            return done(err);
                        }
                        if (!user) {
                            console.log(1);
                            return done
                            (null, false, {
                                message: 'Incorrect email.'
                            });
                        }
                        bcrypt.compare(password, user.password, function(err, result){
                            if(result) {
                                console.log(3);
                                return done(null, user);
                            } else {
                                console.log(2);
                                return done(null, false, {
                                    message: 'Incorrect password.'
                                });
                            }
                        }); 
                    });
                }
            })
        }
    ));
    return passport;
}