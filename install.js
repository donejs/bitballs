var fs = require("fs");
try {
	// it's ok for this to fail
	fs.unlinkSync(__dirname+"/node_modules/.bin/npm");
} catch(e) {

}


var exec = require( "child_process" ).exec;

var child = exec( "npm install", {
	cwd: process.cwd() + "/public"
});

child.stdout.pipe( process.stdout );
child.stderr.pipe( process.stderr );