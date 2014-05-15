'use strict';

// process.env.NODE_ENV = 'production';
var express = require('express');
var http = require('http');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes');
var users = require('./routes/user');
var lab2048 = require('./routes/lab/2048');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// allow access to bower components
app.use('/bower_components', express.static(path.join(__dirname, '/bower_components')));

app.use(app.router);

// ================================================
// routes

// Watch for requests for html instead of jade templates.
app.get('/templates/*', function (req, res) {
    var path = req.params[0];
    res.render('/templates/' + path);
});

app.get('/', routes.index);
app.get('/users', users.list);

app.get('/lab.2048', lab2048.index);

// ================================================

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
