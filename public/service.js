var render = require("can-ssr")({
	config: __dirname + "/package.json!npm",
	main: "bitballs/index.stache!done-autorender"
});

require( "can-ssr/lib/middleware/xhr" )( global );

var setCookies = require( "can-ssr/lib/set-cookies" );

module.exports = function ( req, res, next ) {
	render( req ).then(function( result ) {
    setCookies(req, res);
		var dt = '<!DOCTYPE html>';
		res.send(dt + '\n' +  result.html );
	});
};

