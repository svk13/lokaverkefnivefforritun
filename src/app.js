/* express kóði hér */
const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const routes = require('./schedule');

const app = express();


app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'pug');

app.locals.pretty = true;

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use(() => {
  const err = new Error('Not Found');
  err.status = 404;
});

module.exports = app;
