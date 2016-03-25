var stealTools = require("steal-tools");

var cordovaOptions = {
	buildDir: "./build/cordova",
	id: "com.hello.world",
	name: "HelloWorld",
	platforms: ["ios", "android"],
	index: __dirname + "/index.html",
	files: [
		"node_modules/steal/steal.js"
	]
};

var stealCordova = require("steal-cordova")(cordovaOptions);

var buildPromise = stealTools.build({
	config: __dirname + "/package.json!npm"
});

var cordovaPromise = buildPromise.then(stealCordova.build);

cordovaPromise.then(function(){
	stealCordova.ios.emulate();
}, function(err){
	console.log("an err:", err);
});
