var h = require("./helpers");

var compareHelpers;


var loop = function(a, b, aParent, bParent, prop, compares, options) {
	var checks = options.checks;
	for(var i =0 ; i < checks.length; i++) {
		var res = checks[i](a, b, aParent, bParent, prop, compares || {}, options);
		if(res !== undefined) {
			return res;
		}
	}
	return options["default"];
};
// only adds a or b to `options.result` if missing properties are always on the super set.
// {foo: "bar", "zed": "ted"} intersection {} -> {foo: "bar", "zed": "ted"}
var addIntersectedPropertyToResult = function(a, b, aParent, bParent, prop, compares, options){
	var subsetCheck;
	if( !(prop in aParent)) {
		subsetCheck = "subsetB";
	} else if(prop in bParent){
		// property in a and b and not the same
		return false;
	}
	if( !(prop in bParent) ) {
		subsetCheck = "subsetA";
	}
	if(subsetCheck === "subsetB") {
		options.result[prop] = b;
	} else {
		options.result[prop] = a;
	}
	return undefined;
};

var addToResult = function(fn, name){
	return function(a, b, aParent, bParent, prop, compares, options){
		var res = fn.apply(this, arguments);
		if(res === true) {
			if(prop !== undefined && ! ( prop in options.result )) {
				options.result[prop] = a;
			}
			return true;
		} else {
			return res;
		}
	};
};

module.exports = compareHelpers = {
	equal: function(a, b, aParent, bParent, prop, compares, options) {
		options.checks = [
			compareHelpers.equalComparesType,
			compareHelpers.equalBasicTypes,
			compareHelpers.equalArrayLike,
			compareHelpers.equalObject
		];
		options["default"] = false;

		return loop(a, b, aParent, bParent, prop, compares, options);
	},
	equalComparesType: function(a, b, aParent, bParent, prop, compares, options){
		if(typeof compares === "function") {
			var compareResult = compares(a, b, aParent, bParent, prop, options);
			if(typeof compareResult === "boolean") {
				return compareResult;
			} else if(compareResult && typeof compareResult === "object"){
				// equal objects intersect but have no difference either way
				if( ("intersection" in compareResult) && !("difference" in compareResult)) {
					var reverseResult =  compares(b, a,bParent, aParent, prop, options);
					return ("intersection" in reverseResult) && !("difference" in reverseResult);
				}
				return false;
			}
			return compareResult;
		}
	},
	equalBasicTypes: function(a, b, aParent, bParent, prop, compares, options){
		if (a === null || b === null) {
			return a === b;
		}
		if (a instanceof Date || b instanceof Date) {
			return a === b;
		}
		if (options.deep === -1) {
			return typeof a === 'object' || a === b;
		}
		if (typeof a !== typeof b || h.isArrayLike(a) !== h.isArrayLike(b)) {
			return false;
		}
		if (a === b) {
			return true;
		}
	},
	equalArrayLike: function( a, b, aParent, bParent, prop, compares, options ) {
		if(h.isArrayLike(a) && h.isArrayLike(b) ) {
			if (a.length !== b.length) {
				return false;
			}
			for (var i = 0; i < a.length; i++) {
				var compare = compares[i] === undefined ? compares['*'] : compares[i];
				if (!loop(a[i], b[i], a, b, i, compare, options)) {
					return false;
				}
			}
			return true;
		}
	},
	equalObject: function( a, b, aParent, bParent, parentProp, compares, options ){
		var aType = typeof a;
		if(aType === 'object' || aType === 'function') {
			var bCopy = h.extend({}, b);
			if(options.deep === false) {
				options.deep = -1;
			}

			for (var prop in a) {
				var compare = compares[prop] === undefined ? compares['*'] : compares[prop];
				if (! loop(a[prop], b[prop], a, b, prop, compare, options ) ) {
					return false;
				}
				delete bCopy[prop];
			}
			// go through bCopy props ... if there is no compare .. return false
			for (prop in bCopy) {
				if (compares[prop] === undefined || !loop(undefined, b[prop], a, b, prop, compares[prop], options) ) {
					return false;
				}
			}
			return true;
		}

	},
	subset: function(a, b, aParent, bParent, prop, compares, options) {
		options.checks = [
			compareHelpers.subsetComparesType,
			compareHelpers.equalBasicTypes,
			compareHelpers.equalArrayLike,
			compareHelpers.subsetObject
		];
		options.getSubsets = [];

		options["default"] = false;

		return loop(a, b, aParent, bParent, prop, compares, options);
	},
	subsetObject: function( a, b, aParent, bParent, parentProp, compares, options ){
		var aType = typeof a;
		if(aType === 'object' || aType === 'function') {
			return h.eachInUnique(a,
				function(a, b, aParent, bParent, prop){
					var compare = compares[prop] === undefined ? compares['*'] : compares[prop];
					if ( ! loop(a, b, aParent, bParent, prop, compare, options ) && (prop in bParent) ) {
						return false;
					}
				},
				b,
				function(a, b, aParent, bParent, prop){
					var compare = compares[prop] === undefined ? compares['*'] : compares[prop];
					if (! loop(a, b, aParent, bParent, prop, compare, options ) ) {
						return false;
					}
				},
				true);
		}
	},
	/**
	 * Checks if A is a subset of B.  If A is a subset of B if:
	 * - A \ B = undefined
	 * - A ∩ B = defined
	 * - B ∩ A = defined
	 */
	subsetComparesType: function(a, b, aParent, bParent, prop, compares, options){
		if(typeof compares === "function") {
			var compareResult = compares(a, b, aParent, bParent, prop, options);
			if(typeof compareResult === "boolean") {
				return compareResult;
			} else if(compareResult && typeof compareResult === "object"){
				if( compareResult.getSubset ) {
					if(h.indexOf.call(options.getSubsets, compareResult.getSubset) === -1) {
						options.getSubsets.push(compareResult.getSubset);
					}
				}
				if(compareResult.intersection === h.ignoreType || compareResult.difference === h.ignoreType) { // as in the case of a sort comparator
					return true;
				}
				// A \ B subset intersects in both directions
				// but does not diff from
				if( ("intersection" in compareResult) && !("difference" in compareResult)) {
					var reverseResult =  compares(b, a,bParent, aParent, prop, options);
					return ("intersection" in reverseResult);
				}
				return false;
			}
			return compareResult;
		}
	},
	// returns true if A is superset of B
	// A is a superset if it has fewer properties
	properSupersetObject: function( a, b, aParent, bParent, parentProp, compares, options ){
		var bType = typeof b;
		var hasAdditionalProp = false;
		if(bType === 'object' || bType === 'function') {
			var aCopy = h.extend({}, a);
			if(options.deep === false) {
				options.deep = -1;
			}
			// Check that everything in B is the same as whats in A, or
			// isn't in A.
			for (var prop in b) {
				var compare = compares[prop] === undefined ? compares['*'] : compares[prop];
				// run the comparison no matter what
				var compareResult = loop(a[prop], b[prop], a, b, prop, compare, options );
				// if there wasn't a prop (and we didn't run through a compare)
				if(compareResult === h.ignoreType) {
					// do nothing
				} else if(!(prop in a) ||  options.performedDifference ) {
					hasAdditionalProp = true;
				} else if(!compareResult) {
					return false;
				}
				delete aCopy[prop];
			}
			// go through aCopy props ... if there is no compare .. return false
			for (prop in aCopy) {
				if (compares[prop] === undefined || !loop(a[prop], undefined, a, b, prop, compares[prop], options) ) {
					return false;
				}
			}
			return hasAdditionalProp;
		}

	},
	/**
	 * Checks if A is a subset of B.  If A is a subset of B, A \ B will be undefined. But B \ A will be defined.
	 */
	properSubsetComparesType: function(a, b, aParent, bParent, prop, compares, options){
		if(typeof compares === "function") {
			var compareResult = compares(a, b, aParent, bParent, prop, options);
			if(typeof compareResult === "boolean") {
				return compareResult;
			} else if(compareResult && typeof compareResult === "object"){
				// A \ B subset intersects in both directions
				// but does not diff from
				if( ("intersection" in compareResult) && !("difference" in compareResult)) {
					var reverseResult =  compares(b, a,bParent, aParent, prop, options);
					return ("intersection" in reverseResult) && ("difference" in reverseResult);
				}
				return false;
			}
			return compareResult;
		}
	},

	difference: function(a, b, aParent, bParent, prop, compares, options){
		// a subset is always a difference
		// go through a ... compare to b ....
		// if A has something {foo: "bar"} that B doesn't {} -> return false
		// if B has something that A doesn't and no diff -> return undefined
		// if A \ B returns a diff ... keep it
		options.result = {};
		// this means we should return something for difference
		options.performedDifference = 0;
		options.checks = [
			compareHelpers.differenceComparesType,
			addToResult(compareHelpers.equalBasicTypes,"equalBasicTypes"),
			addToResult(compareHelpers.equalArrayLike,"equalArrayLike"),
			addToResult(compareHelpers.properSupersetObject, "properSubsetObject")
		];

		options["default"] = true;

		var res = loop(a, b, aParent, bParent, prop, compares, options);
		if(res === true && options.performedDifference) {
			return options.result;
		}
		return res;
	},
	differenceComparesType: function(a, b, aParent, bParent, prop, compares, options){
		if(typeof compares === "function") {
			var compareResult = compares(a, b, aParent, bParent, prop, options);
			if(typeof compareResult === "boolean") {
				if(compareResult === true) {
					options.result[prop] = a;
					return true;
				} else {
					return compareResult;
				}
			} else if(compareResult && typeof compareResult === "object"){
				// is there a difference?
				if("difference" in compareResult) {
					if(compareResult.difference === h.ignoreType) {
						return h.ignoreType;
					} else if(compareResult.difference != null) {
						options.result[prop] = compareResult.difference;
						options.performedDifference++;
						return true;
					} else {
						return true;
					}
				} else {
					// if the same ... then OK ... return the union
					if( compareHelpers.equalComparesType.apply(this, arguments) ) {
						options.performedDifference++;
						options.result[prop] = compareResult.union;
					} else {
						return false;
					}
				}
			}
		}
	},
	// A u B
	union: function(a, b, aParent, bParent, prop, compares, options){
		// if everything is the same OR doesn't have a property on the left or right (only)
		// and union values
		options.result = {};
		options.performedUnion = 0;
		options.checks = [
			compareHelpers.unionComparesType,
			addToResult(compareHelpers.equalBasicTypes,"equalBasicTypes"),
			addToResult(compareHelpers.unionArrayLike,"unionArrayLike"),
			addToResult(compareHelpers.unionObject, "unionObject")
		];
		options.getUnions = [];

		options["default"] = false;

		var res = loop(a, b, aParent, bParent, prop, compares, options);
		if(res === true) {
			return options.result;
		}
		return false;
	},
	unionComparesType: function(a, b, aParent, bParent, prop, compares, options){
		if(typeof compares === "function") {
			var compareResult = compares(a, b, aParent, bParent, prop, options);
			if(typeof compareResult === "boolean") {
				if(compareResult === true) {
					options.result[prop] = a;
					return true;
				} else {
					return compareResult;
				}
			} else if(compareResult && typeof compareResult === "object"){
				if( compareResult.getUnion ) {
					if(h.indexOf.call(options.getUnions, compareResult.getUnion) === -1) {
						options.getUnions.push(compareResult.getUnion);
					}
				}
				// is there a difference?
				if("union" in compareResult) {
					if(compareResult.union === h.ignoreType) {
						return compareResult.union;
					}
					if(compareResult.union !== undefined) {
						options.result[prop] = compareResult.union;
					}
					options.performedUnion++;
					return true;
				}
			}
		}
	},
	// if everything is the same OR doesn't have a property on the left or right (only)
	unionObject: function(a, b, aParent, bParent, prop, compares, options){
		var subsetCompare = function(a, b, aParent, bParent, prop){

			var compare = compares[prop] === undefined ? compares['*'] : compares[prop];

			if (! loop(a, b, aParent, bParent, prop, compare, options ) ) {
				var subsetCheck;
				if( !(prop in aParent)) {
					subsetCheck = "subsetB";
				}
				if( !(prop in bParent) ) {
					subsetCheck = "subsetA";
				}
				if(subsetCheck) {
					if( !options.subset ) {
						options.subset = subsetCheck;
					}
					return options.subset === subsetCheck ? undefined: false;
				}

				return false;
			}
		};

		var aType = typeof a;
		if(aType === 'object' || aType === 'function') {
			return h.eachInUnique(a,
				subsetCompare,
				b,
				subsetCompare,
				true);
		}
	},
	// this might be expensive, but work that out later
	unionArrayLike: function( a, b, aParent, bParent, prop, compares, options ) {
		if(h.isArrayLike(a) && h.isArrayLike(b) ) {
			var combined = h.makeArray(a).concat(h.makeArray(b));
			// unique's the combination
			h.doubleLoop(combined, function(item, j, cur, i){
				var res = !compareHelpers.equal(cur, item, aParent, bParent, undefined, compares['*'], {"default": false});
				return res;
			});
			options.result[prop] = combined;
			return true;
		}
	},
	count: function(a, b, aParent, bParent, prop, compares, options){
		// go through and ask for count
		options.checks = [
			compareHelpers.countComparesType,
			compareHelpers.equalBasicTypes,
			compareHelpers.equalArrayLike,
			compareHelpers.loopObject
		];

		options["default"] = false;

		loop(a, b, aParent, bParent, prop, compares, options);

		if( typeof options.count === "number") {
			return options.count;
		}
		return Infinity;
	},
	countComparesType: function(a, b, aParent, bParent, prop, compares, options){
		if(typeof compares === "function") {
			var compareResult = compares(a, b, aParent, bParent, prop, options);
			if(typeof compareResult === "boolean") {
				return true;
			} else if(compareResult && typeof compareResult === "object"){
				// is there a difference?
				if(typeof compareResult.count === "number") {
					if(!("count" in options) || compareResult.count === options.count) {
						options.count = compareResult.count;
					} else {
						options.count = Infinity;
					}
				}
				return true;
			}
		}
	},
	loopObject: function(a, b, aParent, bParent, prop, compares, options){
		var aType = typeof a;
		if(aType === 'object' || aType === 'function') {
			h.each(a, function(aValue, prop){
				var compare = compares[prop] === undefined ? compares['*'] : compares[prop];
				loop( aValue, b[prop], a, b, prop, compare, options );
			});
			return true;
		}
	},
	intersection: function(a, b, aParent, bParent, prop, compares, options){
		// if everything is the same OR doesn't have a property on the left or right (only)
		// and union values
		options.result = {};
		options.performedIntersection = 0;
		options.checks = [
			compareHelpers.intersectionComparesType,
			addToResult(compareHelpers.equalBasicTypes,"equalBasicTypes"),
			addToResult(compareHelpers.intersectionArrayLike,"intersectionArrayLike"),
			compareHelpers.intersectionObject,
		];

		options["default"] = false;

		var res = loop(a, b, aParent, bParent, prop, compares, options);
		if(res === true) {
			return options.result;
		}
		return false;
	},
	intersectionComparesType: function(a, b, aParent, bParent, prop, compares, options){
		if(typeof compares === "function") {
			var compareResult = compares(a, b, aParent, bParent, prop, options);
			if(typeof compareResult === "boolean") {
				if(compareResult === true) {
					options.result[prop] = a;
					return true;
				} else {
					return compareResult;
				}
			} else if(compareResult && typeof compareResult === "object"){
				// is there a difference?
				if("intersection" in compareResult) {
					if(compareResult.intersection !== undefined) {
						options.result[prop] = compareResult.intersection;
					}
					options.performedIntersection++;
					return true;
				}
			}
		}
	},
	intersectionObject: function(a, b, aParent, bParent, prop, compares, options){
		var subsetCompare = function(a, b, aParent, bParent, prop){
			var compare = compares[prop] === undefined ? compares['*'] : compares[prop];

			// If some property value is not the exact same
			if (! loop(a, b, aParent, bParent, prop, compare, options ) ) {
				// figure out which set has extra properties, that set is a subset.
				return addIntersectedPropertyToResult(a, b, aParent, bParent, prop, compares, options);
			}
		};

		var aType = typeof a;
		if(aType === 'object' || aType === 'function') {
			return h.eachInUnique(a,
				subsetCompare,
				b,
				subsetCompare,
				true);
		}
	},
	// this might be expensive, but work that out later
	intersectionArrayLike: function( a, b, aParent, bParent, prop, compares, options ) {
		if(h.isArrayLike(a) && h.isArrayLike(b) ) {
			var intersection = [];
			h.each(h.makeArray(a), function(cur){
				for(var i = 0; i < b.length; i++) {
					if( compareHelpers.equal(cur, b[i], aParent, bParent, undefined, compares['*'], {"default": false}) ) {
						intersection.push(cur);
						break;
					}
				}
			});
			options.result[prop] = intersection;
			return true;
		}
	}
};
