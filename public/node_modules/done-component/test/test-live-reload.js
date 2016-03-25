var QUnit = require("steal-qunit");
var liveReloadTest = require("live-reload-testing");
var F = require("funcunit");

F.attach(QUnit);

QUnit.module("css", {
	setup: function(assert){
		var done = assert.async();
		F.open("//tests/live/index.html", function(){
			done();
		});
	},
	teardown: function(assert){
		var done = assert.async();
		liveReloadTest.reset().then(function(){
			done();
		});
	}
});

QUnit.test("removing css works", function(){
	F("style").exists("the initial style was added to the page");

	F(function(){
		var address = "test/tests/live/foo.component";
		var content = '<can-component tag="foo-bar">' +
			'<style>' +
			'#app {' +
			'color: red;' +
			'height: 20;' +
			'}' +
			'</style>' +
			'<template>' +
			'Hello world' +
			'</template>' +
			'</can-component>';

		liveReloadTest.put(address, content).then(null, function(){
			QUnit.ok(false, "Changing css was not successful");
			QUnit.start();
		});
	});

   F("#app").exists().height(20, "The height is now correct");
   F.wait(100);
});
