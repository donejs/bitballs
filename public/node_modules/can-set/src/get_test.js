var set = require("./set");
var QUnit = require("steal-qunit");
var comparators = require("./comparators");
var h = require("./helpers");

QUnit.module("set/src/get");

var getId = function(d){ return d.id; };

var items = [
	{ id: 0, note: 'C', type: 'eh' },
	{ id: 1, note: 'D', type: 'critical' },
	{ id: 2, note: 'E', type: 'critical' },
	{ id: 3, note: 'F', type: 'eh' },
	{ id: 4, note: 'G', type: 'critical' },
	{ id: 5, note: 'A' },
	{ id: 6, note: 'B', type: 'critical' },
	{ id: 7, note: 'C', type: 'critical' }
];

test("getSubset against non ranged set", function(){
	/*
	 * 1. set b = {} evaluates to all available entities -- the univeral set
	 * 2. set a = { type: 'critical', start: 1, end: 3 } evaluates to entities
	 * 		in set b that have a type property of 'critical'
	 *		e.g. [
	 *			{ id: 1, type: 'critical' },
	 *			{ id: 2, type: 'critical' }, // index 1
	 *			{ id: 4, type: 'critical' }, // index 2
	 *			{ id: 6, type: 'critical' }, // index 3
	 *			{ id: 7, type: 'critical' }
	 *		]
	 * 3. set a is further reduced to the entities at indices 1 through 3
	 *		e.g. [
	 *			{ id: 2, type: 'critical' },
	 *			{ id: 4, type: 'critical' },
	 *			{ id: 6, type: 'critical' }
	 *		]
	 */
	var res = set.getSubset({ type: 'critical', start: 1, end: 3 }, {}, items,
		comparators.rangeInclusive("start", "end"));

	deepEqual(res && h.map.call(res, getId), [2,4,6]);
});

test("getSubset ordered ascending and paginated", function() {
	/*
	 * 1. set b = {} evaluates to all available entities -- the univeral set
	 * 2. set a = { type: 'critical', sort: 'note ASC', start: 1, end: 3 }
	 * 		evaluates to entities in set b that have a type property of 'critical'
	 * 		sorted by the note property
	 *		e.g. [
	 *			{ id: 6, note: 'B', type: 'critical' },
	 *			{ id: 7, note: 'C', type: 'critical' }, // index 1
	 *			{ id: 1, note: 'D', type: 'critical' }, // index 2
	 *			{ id: 2, note: 'E', type: 'critical' }, // index 3
	 *			{ id: 4, note: 'G', type: 'critical' }
	 *		]
	 * 3. set a is further reduced to the entities at indices 1 through 3
	 *		e.g. [
	 *			{ id: 7, note: 'C', type: 'critical' },
	 *			{ id: 1, note: 'D', type: 'critical' },
	 *			{ id: 2, note: 'E', type: 'critical' },
	 *		]
	 */
	var algebra = new set.Algebra(
		comparators.sort('sort'),
		comparators.rangeInclusive('start','end')
	);

	var res = set.getSubset(
		{ type: 'critical', start: 1, end: 3, sort: 'note AsC' },
		{}, items, algebra
	);

	deepEqual(res && h.map.call(res, getId), [7,1,2]);
});

test("getSubset ordered descending and paginated", function() {
	/*
	 * 1. set b = {} evaluates to all available entities -- the univeral set
	 * 2. set a = { type: 'critical', sort: 'note DESC', start: 1, end: 3 }
	 * 		evaluates to entities in set b that have a type property of 'critical'
	 * 		sorted by the note property
	 *		e.g. [
	 *			{ id: 4, note: 'G', type: 'critical' },
	 *			{ id: 2, note: 'E', type: 'critical' }, // index 1
	 *			{ id: 1, note: 'D', type: 'critical' }, // index 2
	 *			{ id: 7, note: 'C', type: 'critical' }, // index 3
	 *			{ id: 6, note: 'B', type: 'critical' },
	 *		]
	 * 3. set a is further reduced to the entities at indices 1 through 3
	 */
	var algebra = new set.Algebra(
		comparators.sort('sort'),
		comparators.rangeInclusive('start','end')
	);

	var res = set.getSubset(
		{ type: 'critical', start: 1, end: 3, sort: 'note deSc' },
		{}, items, algebra
	);

	deepEqual(res && h.map.call(res, getId), [2,1,7]);
});

test("getSubset against paginated set", function(){
	var res = set.getSubset(
		{type: 'critical', start: 21, end: 23},
		{type: 'critical', start: 20, end: 27},
		items,
		comparators.rangeInclusive("start","end") );

	deepEqual(res && h.map.call(res, getId), [2,4,6]);
});

test("getSubset returns undefined against incompatible set", function() {
	var res = set.getSubset(
		{ note: 'C' },
		{ type: 'critical' },
		items
	);

	strictEqual(res, undefined);
});

test("getUnion basics", function(){
	var union = set.getUnion({}, { foo: "bar" }, items, items.slice(0, 3));
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


