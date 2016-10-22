var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json 
// as bitballs don't posts valid json it url encodes it or some what to
// "{ "":"" }" whats not { "":"" } we need to use strict: false
app.use(bodyParser.json({ strict: false}));

module.exports = app;
