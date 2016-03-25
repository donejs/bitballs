"format amd";
define([
	"@loader",
	"qunitjs/qunit/qunit",
	"qunitjs/qunit/qunit.css!"
], function(loader, QUnit){

	if(loader.has("live-reload")) setupLiveReload();

	function setupLiveReload(){
		QUnit.done(updateResults);

		// Check to make sure all tests have passed and update the banner class.
		function updateResults() {
			var tests = document.getElementById("qunit-tests").children;
			var node, passed = true;
			for(var i = 0, len = tests.length; i < len; i++) {
				node = tests.item(i);
				removeAllButLast(node, "runtime");
				if(node.className !== "pass") {
					passed = false;
					break;
				}
			}
			document.getElementById("qunit-banner").className = passed ?
				"qunit-pass" : "qunit-fail";

		}

		function removeAllButLast(parent, className){
			var node, nodes = [];
			var children = parent.children;
			for(var i = 0, len = children.length; i < len; i++) {
				node = children.item(i);
				if(node.className === className) nodes.push(node);
			}
			while(nodes.length > 1) {
				node = nodes.shift();
				parent.removeChild(node);
			}
		}
	}

	QUnit.config.autorun = false;
	steal.done().then(function() {
		if (window.Testee) {
			Testee.init();
		}
		QUnit.load();
	});

	return QUnit;
});
