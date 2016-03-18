var express = require('express');
var app = require('./services/app');
var exec = require( "child_process" ).exec;
var cookieParser = require('cookie-parser');

app.set('port', (process.env.PORT || 5000));

app.use( express.static(__dirname + '/public') );

app.use(cookieParser());

if ( process.argv.indexOf( "--slow" ) !== -1 ) {
	console.log("Delaying everything 1 second");
	app.use( function ( req, res, next ) {
		setTimeout(next, 1000);
	});
}

require('./services/session');

require('./services/games');
require('./services/players');
require('./services/stats');
require('./services/teams');
require('./services/tournaments');
require('./services/users');

//can-ssr:
app.use( "/", require('./public/service') );

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