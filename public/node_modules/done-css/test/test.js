var QUnit = require("steal-qunit");
var F = require("funcunit");

F.attach(QUnit);

QUnit.module("basics", {
	setup: function(){
		F.open("//basics/index.html");
	}
});

QUnit.test("basics works", function(){
	F("style").exists("the style was added to the page");
});

QUnit.module("renderingLoader", {
	setup: function(){
		F.open("//rendering-loader/index.html");
	}
});

QUnit.test("is used when rewriting url()s", function(){
	F("style").exists().text(/example\.com\/app/, "The renderingLoader's base url is http://example.com/app and this was used to rewrite font urls() correctly");
});

QUnit.module("Running in a fake Node environment", {
	setup: function(){
		F.open("//basics/prod-node.html");
	}
});

QUnit.test("The renderingURL is adjusted for Unix/Windows path separator difference", function(){
	F("link").size(1, "There is one link tag");
	F("#app").height(20, "The css adjusted the #app div correctly");
});

QUnit.module("ssr", {
	setup: function(){
		F.open("//ssr/index.html");
	}
});

QUnit.test("ssr works", function(){
	var contextDoc = function ( iframeEl ) {
		var iframeDoc = ( iframeEl.contentWindow || iframeEl.contentDocument );
		if ( iframeDoc.document ) {
		  iframeDoc = iframeDoc.document;
		}
		return iframeDoc;
	};
	F.repeat({
		method: function () {
			var frame = document.getElementById( "funcunit_app" );
			var doc = contextDoc( frame );
			if ( !doc ) return false;

			frame = doc.getElementById( "testframe" );
			if ( !frame ) return false;

			doc = contextDoc( frame );
			if ( !doc ) return false;

			var style = doc.getElementsByTagName( "style" );

			return style.length ? true : false;
		},
		success: function () {
			QUnit.ok( true, "styles applied correctly" );
		}
	});
});

