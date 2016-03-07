import $ from 'jquery';

export default $.ajaxPrefilter(function(options, originalOptions, jqXHR){
	if(options.type === "POST" || options.type === "PUT"){
		options.data = JSON.stringify(originalOptions.data);
		options.contentType = "application/json";
		options.dataType = "json";
	}
});