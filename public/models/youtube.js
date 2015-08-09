define([], function(){
	
	var promise;
	
	
	return function(){
		if(promise) {
			return promise
		} else {
			return promise = new Promise(function(resolve, reject){
				window.onYouTubeIframeAPIReady = function(){
					resolve(YT);
				};
				var tag = document.createElement('script');
		
				tag.src = "https://www.youtube.com/iframe_api";
				document.head.appendChild(tag);
			});
			
		}
		
	};
	
});
