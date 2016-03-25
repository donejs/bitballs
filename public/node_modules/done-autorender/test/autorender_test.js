var QUnit = require("steal-qunit");
var $ = require("jquery");
var F = require("funcunit");

F.attach(QUnit);

var makeIframe = function(src){
	var iframe = document.createElement('iframe');
	window.removeMyself = function(){
		delete window.removeMyself;
		document.body.removeChild(iframe);
		QUnit.start();
	};
	document.body.appendChild(iframe);
	iframe.src = src;
};

QUnit.module("production", {
	setup: function(){
		F.open("//basics/prod.html");
	}
});

QUnit.test("isProduction helper works", function(){
	F("#hi-prod").exists("a div inside of isProduction was rendered");
});

// Only Production mode is supported in IE8.
if(/MSIE 8/.test(navigator.userAgent)) {
	return;
}

QUnit.module("done-autorender",{
	setup: function(){
	   F.open("//basics/index.html");
	}
});

QUnit.test("basics works", function(){
	F("#hello").exists("Content rendered");
	F("#hello").text(/Hello world/, "Correct text");
});

QUnit.module("development mode");

QUnit.asyncTest("the appState is available as the html viewModel", function(){
	makeIframe("basics/test.html");
});

// Fixes the case when can.route is not available (#5)
QUnit.module("no-route", {
	setup: function() {
		F.open("//no_route/index.html");
	}
});

QUnit.test("not using can.route works", function() {
	F("#hello").exists("Content rendered");
	F("#hello").text(/Hello world/, "Correct text");
});

QUnit.module("progressive", {
	setup: function(){
		F.open("//progressive/index.html");
	}
});

QUnit.test("are added to the bundle array", function(){
	F("#bundles").exists().text(/test\/progressive\/bar/,
							   "Normalized name is stored");
});

QUnit.module("async rendering", {
	setup: function(){
		F.open("//async/index.html");
	}
});

QUnit.test("Everything is rendered up front", function(){
	F("home-page").exists(function(){
		var thingRendered = F("#thing").size();
		QUnit.ok(thingRendered, "the #thing was added in a setTimeout but was rendered at the same time as the app because we wait for it");
	});

	F("other-page").exists();
	F("other-page .thing").size(3, "The three list items loaded from the XHR_CACHE");
});

QUnit.module("Using the xhrZone plugin", {
	setup: function(){
		F.open("//xhr/index.html");
	}
});

QUnit.test("Requests are intercepted", function(){
	F(".thing").size(2, "The ajax request was intercepted and returned a list");
});
