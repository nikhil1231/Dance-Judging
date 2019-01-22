const fs = require('fs');
const http = require('http');
const https = require('https');
const privateKey  = fs.readFileSync('server.key', 'utf8');
const certificate = fs.readFileSync('server.crt', 'utf8');
const credentials = {key: privateKey, cert: certificate};

const express = require('express');
const app = express();

const indexPage = require('./routes/index');
const uploadPage = require('./routes/upload');




app.set('view engine', 'pug');
app.use('/', indexPage);
app.use('/upload', uploadPage);

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

httpServer.listen(8080);
httpsServer.listen(8443);
