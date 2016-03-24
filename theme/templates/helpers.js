module.exports = function(docMap, config, getCurrent){
	return {
		ifValidSource: function (src, options) {
		    if (src && config.source){
		        return options.fn(this);
		    }else{
		        return options.inverse(this);
		    }
		},
		urlSource: function(src, options){
			var source = getCurrent().source;

			return source + "/tree/master/" + src;
		}
	};
};
