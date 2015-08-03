var render = require("can-ssr")({
	config: __dirname + "/package.json!npm",
	main: "bitballs/index.stache!done-autorender"
});

var url = require("url");
module.exports = function (req, res) {
	var pathname = url.parse(req.url).pathname;

	render(pathname).then(function(html) {
		var dt = '<!DOCTYPE html>';
		res.send(dt + '\n' + html);
	});
};

