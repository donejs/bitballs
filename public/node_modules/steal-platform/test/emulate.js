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

stealCordova.ios.emulate();
