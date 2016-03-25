var set = require("./set");
var QUnit = require("steal-qunit");
var comparators = require("./comparators");
var h = require("./helpers");

QUnit.module("set/src/get");

var getId = function(d){ return d.id; };

var items = [
	{id: 0, type: 'eh'},
	{id: 1, type: 'critical'},
	{id: 2, type: 'critical'},
	{id: 3, type: 'eh'},
	{id: 4, type: 'critical'},
	{id: 5},
	{id: 6, type: 'critical'},
	{id: 7, type: 'critical'}
];

test("getSubset against non ranged set", function(){


	var res = set.getSubset( {type: 'critical', start: 1, end: 3}, {}, items, comparators.rangeInclusive("start","end") );
	deepEqual(h.map.call(res, getId), [2,4,6]);
});

test("getSubset against ranged set", function(){


	var res = set.getSubset(
		{type: 'critical', start: 21, end: 23},
		{type: 'critical', start: 20, end: 27},
		items,
		comparators.rangeInclusive("start","end") );

	deepEqual(h.map.call(res, getId), [2,4,6]);
});

test("getUnion basics", function(){

	var union = set.getUnion({},{foo: "bar"},items, items.slice(0,3));
	deepEqual(union, items);

});

test("getUnion against ranged sets", function(){

	var union = set.getUnion({start: 10, end: 13},{start: 14, end: 17},items.slice(0,4), items.slice(4,8), comparators.rangeInclusive("start","end"));
	deepEqual(union, items);


	union = set.getUnion({start: 14, end: 17}, {start: 10, end: 13}, items.slice(4,8),items.slice(0,4), comparators.rangeInclusive("start","end"));
	deepEqual(union, items, "disjoint after");
});

test("getUnion against overlapping ranged sets", function(){

	var union = set.getUnion(
		{start: 10, end: 14},
		{start: 13, end: 17},
		items.slice(0,5),
		items.slice(3,8),
		comparators.rangeInclusive("start","end"));

	deepEqual(union, items);

	union = set.getUnion(
		{start: 10, end: 11},
		{start: 11, end: 17},
		items.slice(0,2),
		items.slice(1,8),
		comparators.rangeInclusive("start","end"));

	deepEqual(union, items);

	union = set.getUnion(
		{start: 11, end: 17},
		{start: 10, end: 11},
		items.slice(1,8),
		items.slice(0,2),
		comparators.rangeInclusive("start","end"));

	deepEqual(union, items);
});





