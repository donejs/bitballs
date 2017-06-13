var exec = require( "child_process" ).exec;

var child = exec( "npm install", {
	cwd: process.cwd() + "/public"
});

child.stdout.pipe( process.stdout );
child.stderr.pipe( process.stderr );
