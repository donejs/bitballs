var express = require('express');
var app = require('./app');
var url = require("url");
var exec = require( "child_process" ).exec;

app.set('port', (process.env.PORT || 5000));

app.use( express.static(__dirname + '/public') );

require('./services/games');
require('./services/players');
require('./services/stats');
require('./services/teams');
require('./services/tournaments');
require('./services/sessions');
require('./services/users');

//app.use("/", require('./public/service'));

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


if ( process.argv.indexOf( "--develop" ) !== -1 ) {
  //is dev mode so do live reload
  var child = exec( "node_modules/.bin/steal-tools live-reload", {
    cwd: process.cwd() + "/public"
  });

  child.stdout.pipe( process.stdout );
  child.stderr.pipe( process.stderr );
}