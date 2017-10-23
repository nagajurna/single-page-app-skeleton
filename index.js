'use strict';
//db
const mongoose = require('mongoose');
mongoose.Promise = require('q').Promise;
const db = require( './db' );
//packages
const compression = require('compression')
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const bodyParser = require('body-parser');
const favicon = require('serve-favicon');
const express = require('express');
//router
const users = require('./routes/users');
//const api = require('./routes/api');
//app
const app = express();

//APP SETUP
//compression
app.use(compression());
//cookie-parser
app.use(cookieParser('frenetic soap'));
//express-session
app.use(session({
  name: '_sqlt_.sid',
  store: new MongoStore({ mongooseConnection: db }),
  secret: 'malicious plate',
  resave: false,
  saveUninitialized: false,
}))
//express.static
let oneDay = 86400000;
app.use(express.static('public', { maxAge: 0 }));
//body-parser
app.use(bodyParser.urlencoded({ extended: false, limit: '50mb' }));
app.use(bodyParser.json());
//serve-favicon
app.use(favicon(__dirname + '/public/favicon.ico'));
//routes
app.use('/users', users);
//app.use('/api', api);

let port = process.env.PORT || '4000';
app.set('port', port);

app.listen(port, () => {
  console.log('App listening on port ' + port);
});

module.exports = app;
