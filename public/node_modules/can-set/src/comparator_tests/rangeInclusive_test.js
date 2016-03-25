var QUnit = require("steal-qunit");

var set = require('src/set-core'),
	comparators = require("src/comparators");

QUnit.module("comparators.rangeInclusive");

test('rangeInclusive set.equal', function(){

	/*
	 * X = [A0, ..., An]
	 * Y = [A0, ..., An]
	 */
	ok(
		set.equal(
			{start: 0, end: 100},
			{start: 0, end: 100},
			comparators.rangeInclusive("start", "end")),
		"they are equal" );

	/*
	 * X = [A0, ..., An]
	 * Y = [A0, ..., A(n+1)]
	 */
	ok(
		!set.equal(
			{start: 0, end: 100},
			{start: 0, end: 101},
			comparators.rangeInclusive("start", "end")),
		"they are not equal" );

	/*
	 * X = [A0, ..., An]
	 * Y = [A1, ..., An]
	 */
	ok(
		!set.equal(
			{start: 0, end: 100},
			{start: 1, end: 100},
			comparators.rangeInclusive("start", "end")),
		"they are not equal" );
});

test('rangeInclusive set.subset', function(){
	/*
	 * X = [A0, ..., An]
	 * Y = [A0, ..., An]
	 */
	ok(
		set.subset(
			{start: 0, end: 100},
			{start: 0, end: 100},
			comparators.rangeInclusive("start", "end")),
		"self is a subset" );

	/*
	 * X = [A0, ..., An]
	 * Y = [A0, ..., A(n+1)]
	 */
	ok(
		set.subset(
			{start: 0, end: 100},
			{start: 0, end: 101},
			comparators.rangeInclusive("start", "end")),
		"end extends past subset" );

	/*
	 * X = [A0, ..., An]
	 * Y = [A0, ..., A(n+1)]
	 */
	ok(
		!set.subset(
			{start: 0, end: 101},
			{start: 0, end: 100},
			comparators.rangeInclusive("start", "end")),
		"non-subset extends past end" );

	/*
	 * X = [A1, ..., An]
	 * Y = [A0, ..., An]
	 */
	ok(
		set.subset(
			{start: 1, end: 100},
			{start: 0, end: 100},
			comparators.rangeInclusive("start", "end")),
		"start extends before subset" );

	/*
	 * X = [A1, ..., An]
	 * Y = [A0, ..., An]
	 */
	ok(
		!set.subset(
			{start: 0, end: 100},
			{start: 1, end: 100},
			comparators.rangeInclusive("start", "end")),
		"non-subset extends before start" );
});


test('rangeInclusive set.difference', function() {
	var comparator = comparators.rangeInclusive('start', 'end');

	/*
	 * X = [A0, ..., A99]
	 * Y = [A50, ..., A101]
	 *
	 * X / Y = [A0, ..., A49]
	 */
	var res = set.difference({ start: 0, end: 99 }, { start: 50, end: 101 }, comparator);
	deepEqual(res, { start: 0, end: 49 }, "got a diff");

	/*
	 * let:
	 *   i be the start of set Y
	 *   k be the end of set Y
	 *   0 be the first possible element in X (-infinity)
	 *   n be the last possible element in X (infinity)
	 *
	 * X => universal set
	 * Y = [Ai, ..., Ak]
	 *
	 * X / Y = [A0, ..., A(i-1), Ak, ..., An]
	 * 	more broadly
	 * X / Y = the set of all things not in Y
	 */
	res = set.difference({}, { start: 0, end: 10 }, comparator);
	equal(res, true, 'universal set');

	/*
	 * X = [A0, ..., A49]
	 * Y = [A50, ..., A101]
	 *
	 * X / Y = X
	 */
	res = set.difference({ start: 0, end: 49 }, { start: 50, end: 101 }, comparator);
	deepEqual(res, { start: 0, end: 49 }, "side by side");

	/*
	 * X = [A0, ..., A49]
	 * Y = [A0, ..., A20]
	 *
	 * X / Y = [A21, ..., A49]
	 */
	res = set.difference({ start: 0, end: 49 }, { start: 0, end: 20 }, comparator);
	deepEqual(res, { start: 21, end: 49 }, "first set extends past second");

	/*
	 * X = [A0, ..., A49]
	 * Y = [A20, ..., A49]
	 *
	 * X / Y = [A0, ..., A19]
	 */
	res = set.difference({ start: 0, end: 49 }, { start: 20, end: 49 }, comparator);
	deepEqual(res, { start: 0, end: 19 }, "first set starts before second");
});

test('rangeInclusive set.union', function() {
	var comparator = comparators.rangeInclusive('start', 'end');


	/*
	 * X = [A0, ..., A99]
	 * Y = [A50, ..., A101]
	 *
	 * X U Y = [A0, ..., A101]
	 */
	var res = set.union({ start: 0, end: 99 }, { start: 50, end: 101 }, comparator);
	deepEqual(res, { start: 0, end: 101 }, "got a union");

	/*
	 * X = universal set
	 * Y = [A0, ..., A10]
	 *
	 * X U Y = X
	 */
	res = set.union({}, { start: 0, end: 10 }, comparator);
	deepEqual(res, {}, "universal set");

	/*
	 * X = [A100, ..., A199]
	 * Y = [A200, ..., A299]
	 *
	 * X U Y = [A100, ..., A299]
	 */
	res = set.union({start: 100, end: 199}, {start: 200, end: 299}, comparator);
	deepEqual(res, {start:100, end:299}, "no intersection");

	/*
	 * X = [A200, ..., A299]
	 * Y = [A100, ..., A199]
	 *
	 * X U Y = [A100, ..., A299]
	 */
	res = set.union({start: 200, end: 299}, {start: 100, end: 199}, comparator);
	deepEqual(res, {start:100, end:299}, "no intersection with either argument order");

	/*
	 * X = [A200, ..., A299]
	 * Y = [A100, ..., A209]
	 *
	 * X U Y = [A100, ..., A299]
	 */
	res = set.union({start: 200, end: 299}, {start: 100, end: 209}, comparator);
	deepEqual(res, {start:100, end:299}, "sets can intersect");

	/*
	 * X = [A200, ..., A299]
	 * Y = [A100, ..., A209]
	 *
	 * X U Y = [A100, ..., A299]
	 */
	res = set.union({start: 100, end: 209}, {start: 200, end: 299}, comparator);
	deepEqual(res, {start:100, end:299}, "sets can intersect with either argument order");

	/*
	 * X = [A100, ..., A299]
	 * Y = [A103, ..., A209]
	 *
	 * X U Y = [A100, ..., A299]
	 */
	res = set.union({start: 100, end: 299}, {start: 103, end: 209}, comparator);
	deepEqual(res, {start:100, end:299}, "first set contains second");

	/*
	 * X = [A103, ..., A209]
	 * Y = [A100, ..., A299]
	 *
	 * X U Y = [A100, ..., A299]
	 */
	res = set.union({start: 100, end: 299}, {start: 103, end: 209}, comparator);
	deepEqual(res, {start:100, end:299}, "second set contains first");

	/*
	 * X = [A100, ..., A299]
	 * Y = [A100, ..., A299]
	 *
	 * X U Y = [A100, ..., A299]
	 */
	res = set.union({start: 100, end: 299}, {start: 100, end: 299}, comparator);
	deepEqual(res, {start:100, end:299}, "union of identical sets is the same as those sets");
});



test('rangeInclusive set.count', function(){
	var comparator = comparators.rangeInclusive('start', 'end');

	/*
	 * X = [A0, ..., A99]
	 * |X| = 100
	 */
	var res = set.count({ start: 0, end: 99 }, comparator);
	equal(res, 100, "count is right");
});

test('rangeInclusive set.intersection', function(){
	var comparator = comparators.rangeInclusive('start', 'end');

	/*
	 * X = [A0, A99]
	 * Y = [A50, A101]
	 *
	 * X ∩ Y = [A50, A99]
	 */
	var res = set.intersection({ start: 0, end: 99 }, { start: 50, end: 101 }, comparator);
	deepEqual(res, { start: 50, end: 99 }, "got a intersection");
});
