define(["@loader"], function(loader){
	var global = loader.global;


	// Local copy of Node require
	var nodeRequire = loader._nodeRequire;

	var isNode = typeof process === "object" &&
			{}.toString.call(process) === "[object process]";

	var ua = typeof navigator !== "undefined" ? navigator.userAgent : "";

	var isiOS = /iPhone OS/.test(ua);
	var isAndroid = /Android/.test(ua);

	var platform = {

		// Node.js
		isNode: isNode,

		isiOS: isiOS,

		isAndroid: isAndroid,

		// Cordova
		isCordova: (isiOS || isAndroid) && document.location.protocol === "file:",

		// NW.js
		isNW: isNode && (function(){
			try {
				return nodeRequire("nw.gui") !== "undefined";
			} catch(e) {
				return false;
			}
		})()

	};

	// Mobile browser (screen size?)

	// Desktop browser
	platform.isDesktopBrowser = !platform.isNode && !platform.isCordova &&
		!platform.isNW;

	return platform;
});
