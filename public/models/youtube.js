var platform = require("steal-platform" );

var promise;

module.exports = function(){
	if(promise) {
		return promise;
	} else {
		return promise = new Promise(function(resolve, reject){
			if ( platform.isNode ) {
				reject({});
				return;
			}
			window.onYouTubeIframeAPIReady = function(){
				resolve(YT);
			};
			var tag = document.createElement('script');

			tag.src = "https://www.youtube.com/iframe_api";
			document.head.appendChild(tag);
		});
	}
};
