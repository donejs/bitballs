var h = require("./helpers");

function makeComparator(fn) {
	return function() {
		var result = {};
		h.each(arguments, function(propertyName){
			result[propertyName] = fn;
		});
		return result;
	};
}


var within = function(value, range){
	return value >= range[0] && value <= range[1];
};

// diff from setA's perspective
var diff = function(setA, setB, property1, property2){
	// p for param
	// v for value
	var sAv1 = setA[property1],
		sAv2 = setA[property2],
		sBv1 = setB[property1],
		sBv2 = setB[property2],
		count = sAv2 - sAv1 + 1;

	var after = {
		difference: [sBv2+1, sAv2],
		intersection: [sAv1,sBv2],
		union: [sBv1, sAv2],
		count: count,
		meta: "after"
	};
	var before = {
		difference: [sAv1, sBv1-1],
		intersection: [sBv1,sAv2],
		union: [sAv1, sBv2],
		count: count,
		meta: "before"
	};

	// if the sets are equal
	if(sAv1 === sBv1 && sAv2 === sBv2) {
		return {
			intersection: [sAv1,sAv2],
			union: [sAv1,sAv2],
			count: count,
			meta: "equal"
		};
	}
	// A starts at B but A ends later
	else if( sAv1 === sBv1 && sBv2 < sAv2 ) {
		return after;
	}
	// A end at B but A starts earlier
	else if( sAv2 === sBv2 && sBv1 > sAv1 ) {
		return before;
	}
	// B contains A
	else if( within(sAv1, [sBv1, sBv2]) && within(sAv2, [sBv1, sBv2]) ) {
		return {
			intersection: [sAv1,sAv2],
			union: [sBv1, sBv2],
			count: count,
			meta: "subset"
		};
	}
	// A contains B
	else if( within(sBv1, [sAv1, sAv2]) && within(sBv2, [sAv1, sAv2]) ) {
		return {
			intersection: [sBv1,sBv2],
			// there is a difference in what A has
			difference: [null, null],
			union: [sAv1, sAv2],
			count: count,
			meta: "superset"
		};
	}
	// setA starts earlier and overlaps setB
	else if(sAv1 < sBv1 && within(sAv2, [sBv1, sBv2]) ) {
		return before;
	}
	// setB starts earlier and overlaps setA
	else if(sBv1 < sAv1 && within(sBv2, [sAv1, sAv2]) ) {
		return after;
	}
	// side by side ... nothing intersection
	else if(sAv2 === sBv1-1) {
		return {
			difference: [sAv1,sAv2],
			union: [sAv1, sBv2],
			count: count,
			meta: "disjoint-before"
		};
	}

	else if(sBv2 === sAv1 - 1) {
		return {
			difference: [sAv1,sAv2],
			union: [sBv1, sAv2],
			count: count,
			meta: "disjoint-after"
		};
	}
	if(!isNaN(count)) {
		return {
			count: count,
			meta: "disjoint"
		};
	}

};

var cleanUp = function(value, enumData) {
	if(!value) {
		return enumData;
	}
	if(!h.isArrayLike(value)) {
		value = [value];
	}
	if(!value.length) {
		return enumData;
	}
	return value;
};

module.exports = {
	"enum": function(prop, enumData){
		var compares = {};
		compares[prop] = function(vA, vB, A, B){
			vA = cleanUp(vA, enumData);
			vB = cleanUp(vB, enumData);

			var data = h.arrayUnionIntersectionDifference(vA, vB);
			// if the difference is empty ... there is no difference
			if( !data.difference.length ) {
				delete data.difference;
			}

			// if any of them have everything, return undefined
			h.each(data, function(value, prop){
				if(h.isArrayLike(value)) {
					if(h.arraySame(enumData, value)) {
						data[prop] = undefined;
					} else if(value.length === 1) {
						data[prop] = value[0];
					}
				}
			});

			return data;
		};
		return compares;
	},
	/**
	 * Makes a comparator for two ranged properties that specify a range of items
	 * that includes both the startIndex and endIndex.  For example, a range of
	 * [0,20] loads 21 items.
	 *
	 * @param {String} startIndexProperty
	 * @param {String} endIndexProperty
	 *
	 * @body
	 *
	 * ## Use
	 *
	 * ```
	 * new set.Algebra( extend({}, comparators.rangeInclusive("start","end") ) )
	 * ```
	 */
	rangeInclusive: function(startIndexProperty, endIndexProperty){
		var compares = {};
		var makeResult = function(result, index) {
			var res = {};
			if(result.intersection) {
				res.intersection = result.intersection[index];
			}
			if(result.difference){
				res.difference = result.difference[index];
			}
			if(result.union) {
				res.union = result.union[index];
			}
			if(result.count) {
				res.count = result.count;
			}
			return res;
		};

		compares[startIndexProperty] = function(vA, vB, A, B){
			if(vA === undefined) {
				return;
			}
			var res = diff(A, B, startIndexProperty, endIndexProperty);


			var result = makeResult(res, 0);
			result.getSubset = function(a, b, bItems, algebra, options){
				return bItems;
			};
			result.getUnion = function(a, b, aItems, bItems, algebra, options){
				return [aItems,bItems];
			};
			return result;
		};
		compares[endIndexProperty] = function(vA, vB, A, B){
			if(vA === undefined) {
				return;
			}
			var data= diff(A, B, startIndexProperty, endIndexProperty);
			var res = makeResult( data, 1);
			// if getSubset ... remove from the .get
			res.getSubset = function(a, b, bItems, algebra, options){
				var aStartValue = a[startIndexProperty],
					aEndValue = a[endIndexProperty];

				var bStartValue = b[startIndexProperty];

				if(  ! (endIndexProperty in b) || ! (endIndexProperty in a)  ) {
					return bItems.slice(aStartValue, aEndValue+1);
				}
				return bItems.slice( aStartValue - bStartValue, aEndValue - bStartValue + 1 );
			};
			res.getUnion = function(a, b, aItems, bItems, algebra, options){
				// if a is after b
				if(data.meta.indexOf("after") >= 0) {
					// if they overlap ... shave some off
					if(data.intersection) {
						bItems = bItems.slice( 0, data.intersection[0]-b[startIndexProperty]  );
					}
					return [bItems, aItems];
				}

				if(data.intersection) {
					aItems = aItems.slice( 0, data.intersection[0]-a[startIndexProperty]  );
				}
				return [aItems,bItems];
			};

			return res;
		};
		return compares;
	},
	/**
	 * @function
	 * Makes boolean
	 */
	"boolean": makeComparator(function(propA, propB) {
		// prop a is probably true
		var notA = !propA,
			notB = !propB;
		if( propA === notB && propB === notA ) {
			return {
				difference: !propB,
				union: undefined
			};
		} else if(propA === undefined) {
			return {
				difference: !propB,
				intersection: propB,
				union: undefined
			};
		}
	})
};
