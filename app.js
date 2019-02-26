const fs = require('fs');
const http = require('http');
const https = require('https');
const path = require('path');
const bodyParser = require('body-parser')
const privateKey  = fs.readFileSync('server.key', 'utf8');
const certificate = fs.readFileSync('server.crt', 'utf8');
const credentials = {key: privateKey, cert: certificate};

const express = require('express');
const app = express();

const indexPage = require('./routes/index');
const uploadPage = require('./routes/upload');
const listPage = require('./routes/list');
const judgePage = require('./routes/judge');

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'www')));
app.use(express.static(path.join(__dirname, 'videos')));

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, './views'));

app.use('/', indexPage);
app.use('/upload', uploadPage);
app.use('/list', listPage);
app.use('/judge', judgePage);

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

httpServer.listen(8080);
httpsServer.listen(8443);
