var loader = require("@loader");

// Register for server-side rendering.
var register = loader.has("asset-register") ?
	loader.get("asset-register")["default"] : function(){};

var globalDoc = (function () {
	if ( typeof canSsr !== "undefined" && canSsr.globalDocument ) {
		return canSsr.globalDocument;
	}

	if(typeof doneSsr !== "undefined" && doneSsr.globalDocument) {
		return doneSsr.globalDocument;
	}

	return typeof document === "undefined" ? undefined : document;
});

function getExistingAsset(load, head){
	var selector = "[asset-id='" + load.name + "']";
	var val = (typeof jQuery !== 'undefined') ?
						jQuery(selector) :
						globalDoc().querySelectorAll(selector);
	return val && val[0];
}

function addSlash(url) {
	var hasSlash = url[url.length - 1] === "/";
	return url + (hasSlash ? "" : "/");
}

var isNode = typeof process === "object" &&
	{}.toString.call(process) === "[object process]";

var isNW = (function(){
	try {
		return typeof loader._nodeRequire("nw.gui") !== "undefined";
	} catch(e) {
		return false;
	}
})();

var isProduction = (loader.isEnv && loader.isEnv("production")) || (loader.envMap && loader.envMap.production) || loader.env === "production";
if(isProduction) {
	exports.fetch = function(load) {
		// return a thenable for fetching (as per specification)
		// alternatively return new Promise(function(resolve, reject) { ... })
		var cssFile = load.address;

		var link;
		if(isNode && !isNW) {
			var path = loader._nodeRequire("path");
			cssFile = path.relative(loader.baseURL, cssFile)
				.replace(/\\/g, "/");

			var href = "/" + cssFile;

			// If server side rendering and a baseURL is set, use it.
			if(loader.renderingLoader) {
				var baseURL = loader.renderingLoader.baseURL;
				if(baseURL.indexOf("http") === 0) {
					href = addSlash(baseURL) + cssFile.replace("dist/", "");
				}
			}

			register(load.name, "css", function(){
				var link = globalDoc().createElement('link');
				link.setAttribute("rel", "stylesheet");
				link.setAttribute("href", href);
				return link;
			});
		} else {
			var doc = globalDoc();
			if(typeof doc !== "undefined") {
				var head = doc.head || doc.getElementsByTagName("head")[0];
				link = getExistingAsset(load, head);
				if(!link) {
					link = doc.createElement('link');
					link.rel = 'stylesheet';
					link.href = cssFile;

					head.appendChild(link);
				}
			}
		}

		return "";
	};
} else {
	exports.instantiate = function(load) {
		var loader = this;

		load.metadata.deps = [];
		load.metadata.execute = function(){
			var liveReloadEnabled = loader.liveReloadInstalled || loader.has("live-reload");
			var source = load.source+"/*# sourceURL="+load.address+" */";
			var address = load.address;

			// If on the server use the renderingLoader to use the correct
			// address when rewriting url()s.
			if(loader.renderingLoader) {
				var href = load.address.substr(loader.baseURL.length);
				var baseURL = addSlash(loader.renderingLoader.baseURL);
				address = steal.joinURIs(baseURL, href);
			}

			source = source.replace(/url\(['"]?([^'"\)]*)['"]?\)/g, function(whole, part) {
				return "url(" + steal.joinURIs(address, part) + ")";
			});

			var loadPromise = Promise.resolve();
			if(load.source && typeof globalDoc() !== "undefined") {
				var gDoc = globalDoc();
				var doc = gDoc.head ? gDoc : gDoc.getElementsByTagName ?
					gDoc : gDoc.globalDocElement;

				var head = doc.head || doc.getElementsByTagName('head')[0];

				if(!head) {
					var docEl = doc.globalDocElement || doc;
					head = gDoc.createElement("head");
					docEl.insertBefore(head, docEl.firstChild);
				}

				var style = getExistingAsset(load, head);
				if(!style || style.__isDirty) {
					style = gDoc.createElement('style')

					// make source load relative to the current page

					style.type = 'text/css';

					if (style.styleSheet){
						style.styleSheet.cssText = source;
					} else {
						style.appendChild(gDoc.createTextNode(source));
					}
					head.appendChild(style);
				}

				if(liveReloadEnabled) {
					var cssReload = loader["import"]("live-reload", { name: "$css" });
					loadPromise = Promise.resolve(cssReload).then(function(reload){
						reload.once("!dispose/" + load.name, function(){
							style.__isDirty = true;
							reload.once("!cycleComplete", function(){
								head.removeChild(style);
							});
						});
					});
				}

				// For server-side rendering, register this module.
				register(load.name, "css", function(){
					return style.cloneNode(true);
				});
			}

			return loadPromise.then(function(){
				return System.newModule({source: source});
			});
		};
		load.metadata.format = "css";
	};

}

exports.buildType = "css";
exports.includeInBuild = true;
