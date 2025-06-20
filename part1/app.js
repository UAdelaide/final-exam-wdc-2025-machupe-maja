const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const db = require('./db.js');
const indexRouter = require('./routes/index');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

let dbConn;
db.setup().then((connection) => {
  dbConn = connection;
});

// Put the connection in the request
app.use((req, res, next) => {
  req.db = dbConn;
  next();
});

app.use('/', indexRouter);

module.exports = app;

