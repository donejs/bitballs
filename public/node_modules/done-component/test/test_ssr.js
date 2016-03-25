var canSsr = require("can-ssr");
var helpers = require("can-ssr/test/helpers");
var assert = require("assert");
var path = require("path");

describe("done-component server side rendering", function(){
	before(function(){
		this.render = canSsr({
			config: path.join(__dirname, "tests", "ssr", "package.json!npm"),
			main: "index.stache!done-autorender"
		});
	});

	it("css gets rendered", function(done){
		this.render("/").then(function(result){
			var html = result.html;

			var node = helpers.dom(html);

			var foundStyle = false;
			helpers.traverse(node, function(el){
				if(el.nodeName === "STYLE") {
					foundStyle = true;
				}
			});

			assert.equal(foundStyle, true, "Found the style element");
		}).then(done);
	});

});
