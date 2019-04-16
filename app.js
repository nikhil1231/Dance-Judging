require('dotenv').config();

const fs = require('fs');
const http = require('http');
const https = require('https');
const path = require('path');
const bodyParser = require('body-parser')
const privateKey = fs.readFileSync('server.key', 'utf8');
const certificate = fs.readFileSync('server.crt', 'utf8');
const credentials = {
    key: privateKey,
    cert: certificate
};
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const flash = require('connect-flash');

const express = require('express');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
// app.use(express.static(path.join(__dirname, 'www')));
app.use(express.static(path.join(__dirname, 'views')));
app.use(express.static(path.join(__dirname, 'videos')));
app.use("/recordings", express.static(path.join(__dirname, 'recordings')));

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({
        url: "mongodb://localhost:27017/sessions",
        collection: "session"
    })
}))

var passport = require('./models/passport')(app);


app.use(flash());

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, './views'));

const indexPage = require('./routes/index');
const uploadPage = require('./routes/upload');
const listPage = require('./routes/list');
const judgePage = require('./routes/judge');
const authPage = require('./routes/auth')(passport);

app.use('/', indexPage);
app.use('/upload', uploadPage);
app.use('/list', listPage);
app.use('/judge', judgePage);
app.use('/auth', authPage);

/* flash test
app.get('/flash', function (req, res) {
    // Set a flash message by passing the key, followed by the value, to req.flash().
    req.flash('test', 'Flash is back!~!~!!')
    res.send('flash');
});

app.get('/flash-display', function(req, res){
    // Get an array of flash messages by passing the key to req.flash()
    var fmsg = req.flash();
    console.log(fmsg);
    res.send(fmsg);
  });
  */

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

httpServer.listen(8080);
httpsServer.listen(8443);