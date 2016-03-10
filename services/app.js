var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var exec = require( "child_process" ).exec;

app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json 
app.use(bodyParser.json());

module.exports = app;