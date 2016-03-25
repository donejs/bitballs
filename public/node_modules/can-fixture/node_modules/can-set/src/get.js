var compare = require("./compare");
var set = require("./set-core");
var h = require("./helpers");

// want A and B, but A w/o the range
var defaultGetSubset = function(a, b, bItems, algebra, options){
	return h.filter.call(bItems, function(item){
		return set.subset(item, a, algebra);
	});
};


module.exports = {
	getSubset: function(a, b, bItems, algebra){
		var options = {};

		var isSubset = compare.subset(a, b, undefined, undefined, undefined, algebra, options);

		if(isSubset) {
			var aItems = bItems.slice(0);

			var aCopy = h.extend({}, a);

			// remove properties that are going to do their own filtering.
			h.each(options.removeProps, function(prop){
				delete aCopy[prop];
			});
			aItems = defaultGetSubset(aCopy, b, aItems, algebra, options);
			h.each(options.getSubsets, function(filter){
				aItems = filter(a,b, aItems, algebra, options);
			});

			return aItems;
		}

	},
	getUnion: function(a,b,aItems, bItems, algebra){
		var options = {};
		if(compare.subset(a, b, undefined, undefined, undefined, algebra, options)) {
			return bItems;
		} else if(compare.subset(b, a, undefined, undefined, undefined, algebra, options)) {
			return aItems;
		}

		var isUnion = compare.union(a, b, undefined, undefined, undefined, algebra, options);

		if(isUnion) {
			h.each(options.getUnions, function(filter){
				var items = filter(a,b, aItems, bItems, algebra, options);
				aItems = items[0];
				bItems = items[1];
			});
			return aItems.concat(bItems);
		}
	}
};
