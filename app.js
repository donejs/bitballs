var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var exec = require( "child_process" ).exec;

if ( process.argv.indexOf( "--develop" ) !== -1 ) {
  //is dev mode so do live reload
  var child = exec( "node_modules/.bin/steal-tools live-reload", {
    cwd: process.cwd() + "/public"
  });

  child.stdout.pipe( process.stdout );
  child.stderr.pipe( process.stderr );
  
  app.use( function ( req, res, next ) {
    req.isDev = true;
    next();
  });
}

app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json 
app.use(bodyParser.json());

module.exports = app;