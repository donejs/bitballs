var IgnoreType = function(){};

var helpers;
module.exports = helpers = {
	extend: function(d, s){
		for(var prop in s) {
			d[prop] = s[prop];
		}
		return d;
	},
	isArrayLike: function(arr){
		return arr && (typeof arr === "object") && (typeof arr.length === "number") && (arr.length >= 0) && (arr.length === 0 || ( (arr.length-1) in arr) );
	},
	each: function(obj, cb){
		if(helpers.isArrayLike(obj)) {
			for(var i = 0 ; i < obj.length; i++) {
				if( cb( obj[i], i ) === false ) {
					break;
				}
			}
		} else {
			for(var prop in obj) {
				if( obj.hasOwnProperty(prop) ) {
					if( cb( obj[prop], prop ) === false ) {
						break;
					}
				}
			}
		}
		return obj;
	},
	// loops through all unique props in a and then in b
	eachInUnique: function(a, acb, b, bcb, defaultReturn){
		var bCopy = helpers.extend({}, b),
			res;
		for (var prop in a) {
			res = acb(a[prop], b[prop], a, b, prop );
			if(res !== undefined) {
				return res;
			}
			delete bCopy[prop];
		}
		for (prop in bCopy) {
			res = bcb(undefined, b[prop], a, b, prop );
			if(res !== undefined) {
				return res;
			}
		}
		return defaultReturn;
	},
	makeArray: function(arr){
		var array = [];
		helpers.each(arr, function(item){
			array.push(item);
		});
		return array;
	},
	doubleLoop: function(arr, callbacks){
		if(typeof callbacks === "function") {
			callbacks = {iterate: callbacks};
		}
		var i = 0;
		while(i < arr.length) {
			if(callbacks.start) {
				callbacks.start(arr[i]);
			}

			var j = i+1;
			while( j < arr.length ) {
				if(callbacks.iterate(arr[j], j, arr[i], i) === false) {
					arr.splice(j, 1);
				} else {
					j++;
				}
			}
			if(callbacks.end) {
				callbacks.end(arr[i]);
			}
			i++;
		}
	},
	identityMap: function(arr){
		var map = {};
		helpers.each(arr, function(value){
			map[value] = 1;
		});
		return map;
	},
	arrayUnionIntersectionDifference: function(arr1, arr2){
		var map = {};

		var intersection = [];
		var union = [];
		var difference = arr1.slice(0);

		helpers.each(arr1, function(value){
			map[value] = true;
			union.push(value);
		});

		helpers.each(arr2, function(value){
			if(map[value]) {
				intersection.push(value);
				var index = helpers.indexOf.call(difference, value);
				if(index !== -1) {
					difference.splice(index, 1);
				}

			} else {
				union.push(value);
			}
		});

		return {
			intersection: intersection,
			union: union,
			difference: difference
		};
	},
	arraySame: function(arr1, arr2){
		if(arr1.length !== arr2.length) {
			return false;
		}
		var map = helpers.identityMap(arr1);
		for(var i = 0 ; i < arr2.length; i++) {
			var val = map[arr2[i]];
			if(!val) {
				return false;
			} else if(val > 1){
				return false;
			} else {
				map[arr2[i]]++;
			}
		}
		return true;
	},
	indexOf: Array.prototype.indexOf || function(item) {
		for (var i = 0, thisLen = this.length; i < thisLen; i++) {
			if (this[i] === item) {
				return i;
			}
		}
		return -1;
	},
	map: Array.prototype.map || function(cb){
		var out = [];
		for(var i = 0, len = this.length; i < len; i++) {
			out.push(cb(this[i], i, this));
		}
		return out;
	},
	filter: Array.prototype.filter || function(cb){
		var out = [];
		for(var i = 0, len = this.length; i < len; i++) {
			if(cb(this[i], i, this)) {
				out.push(this[i]);
			}
		}
		return out;
	},
	isEmptyObject: function(obj) {
		var prop;

		for(prop in obj) {
			if(obj.hasOwnProperty(prop)) {
				break;
			}
		}

		return prop === undefined;
	},
	// This is a dummy object that can signal to be ignored
	ignoreType: new IgnoreType(),
	firstProp: function(set){
		for(var prop in set) {
			return prop;
		}
	},
	last: function(arr){
		return arr[arr.length -1];
	},
	index: function(compare, items, props){
		if(!items || !items.length) {
			return undefined;
		}
		// check the start and the end
		if( compare(props, items[0]) === -1 ) {
			return 0;
		}
		else if(compare(props, helpers.last(items) ) === 1 ) {
			return items.length;
		}
		var low = 0,
			high = items.length;

		// From lodash lodash 4.6.1 <https://lodash.com/>
		// Copyright 2012-2016 The Dojo Foundation <http://dojofoundation.org/>
		while (low < high) {
			var mid = (low + high) >>> 1,
				item = items[mid],
				computed = compare(props, item);
			if ( computed === -1 ) {
				high = mid;
			} else {
				low = mid + 1;
			}
		}
		return high;
		// bisect by calling sortFunc
	},
	defaultSort: function(sortPropValue, item1, item2) {
		var parts = sortPropValue.split(' ');
		var sortProp = parts[0];
		var item1Value = item1[sortProp];
		var item2Value = item2[sortProp];
		var temp;
		var desc = parts[1] || '';
		desc = desc.toLowerCase()	=== 'desc';

		if(desc) {
			temp = item1Value;
			item1Value = item2Value;
			item2Value = temp;
		}

		if(item1Value < item2Value) {
			return -1;
		}

		if(item1Value > item2Value) {
			return 1;
		}

		return 0;
	}
};
