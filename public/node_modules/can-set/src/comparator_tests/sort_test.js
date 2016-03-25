var QUnit = require("steal-qunit");

var set = require('src/set-core'),
	comparators = require("src/comparators"),
	h = require("src/helpers");

QUnit.module("comparators.sort");

test('set.difference', function(){
	var comparator = comparators.sort('sort');

	var res = set.difference({sort: "foo"}, { completed: true }, comparator);
	ok(res === true, "diff should be true");

	res = set.difference({ completed: true }, { completed: true, sort: "foo" }, comparator);
	equal(res, false, "the same except for sort");

	res = set.difference({ completed: true }, { sort: "foo"}, comparator);
	equal(res, false);

	res = set.difference({ completed: true }, { foo: 'bar', sort: "foo" }, comparator);
	equal(res, false);
});

test('set.difference({ function })', function() {
	var algebra = new set.Algebra(
		comparators.sort('sort'),
		{
			colors: function() {
				return {
					difference: ['red' ],
					intersection: ['blue']
				};
			}
		});



	var res = algebra.difference({ colors: ['red','blue'], sort: 'colors' },
		{ colors: ['blue'] });

	deepEqual(res, { colors: [ 'red' ] });
});

test('set.union', function(){
	var comparator = comparators.sort('sort');
	// set / subset
	var res = set.union({sort: "name"}, { completed: true }, comparator);
	deepEqual(res , {}, "set / subset sort left");

	res = set.union({}, { completed: true, sort: "name" }, comparator);
	deepEqual(res , {}, "set / subset sort right");

	res = set.union({ sort: "name" }, { completed: true, sort: "namer" }, comparator);
	deepEqual(res , {}, "set / subset both sorts");

	res = set.union({ completed: true }, {sort: "foo"}, comparator);
	deepEqual(res , {}, "subset / set");

	res = set.union({foo: "bar", sort: "foo"},{foo: "bar"}, comparator);
	deepEqual(res, {foo: "bar"}, "equal");

	res = set.union({foo: "bar"},{foo: "zed", sort: "foo"}, comparator);
	ok(!res, "values not equal");

	res = set.union({foo: "bar", sort: "foo"},{name: "A"}, comparator);
	ok(!res, "values not equal");
});

test('set.union Array', function(){
	var comparator = comparators.sort('sort');
	var res = set.union({foo: ["a","b"], sort: "foo"}, { foo: ["a","c"] },
		comparator);

	deepEqual(res , {foo: ["a","b","c"]}, "set / subset");
});

test('set.count', function(){
	ok( set.count({ sort: 'name' }) === Infinity, "defaults to infinity");
	ok( set.count({foo: "bar", sort: "foo"},{}) === Infinity, "defaults to infinity");

	equal( set.count({foo: "bar", sort: "foo"}, {
		foo: function(){
			return {
				count: 100
			};
		}
	}), 100, "works with a single value");
});

test('set.intersection', function(){

	var comparator = comparators.sort('sort');

	var res = set.intersection({} , { sort: 'name' }, comparator);
	deepEqual(res, {}, "");

	res = set.intersection({ sort: 'name' } , { sort: 'name' }, comparator);
	deepEqual(res, {}, "");

	res = set.intersection({type: 'new'} , { sort: 'name', userId: 5 }, comparator);
	deepEqual(res, {type: 'new', userId: 5 }, "");

	res = set.intersection({type: 'new', sort: "age"} , { sort: 'name', userId: 5 }, comparator);
	deepEqual(res, {type: 'new', userId: 5 }, "");
});

test('set.intersection Array', function(){
	var comparator = comparators.sort('sort');
	var res = set.intersection({foo: ["a","b"], sort: 'foo'},
		{ foo: ["a","c"] }, comparator);

	deepEqual(res , {foo: ["a"]}, "intersection");
});

test('set.subset', function(){
	var ignoreProp = function(){ return true; };

	var algebra = new set.Algebra(comparators.sort('sort'),{
		foo: ignoreProp,
		bar: ignoreProp,
		kind: ignoreProp,
		count: ignoreProp
	});

	ok( algebra.subset(
		{ type : 'FOLDER', sort: "thing" },
		{ type : 'FOLDER' } ), 'equal sets with sort on the left');

	ok( algebra.subset(
		{ type : 'FOLDER' },
		{ type : 'FOLDER', sort: "thing" } ), 'equal sets with sort on the right');

	ok( algebra.subset(
		{ type : 'FOLDER', parentId : 5, sort: 'thing' },
		{ type : 'FOLDER'} ), 'sub set with sort on the left');

	ok( algebra.subset(
		{ type : 'FOLDER', parentId : 5 },
		{ type : 'FOLDER', sort: 'thing'} ), 'sub set with sort on the right');

	ok(!algebra.subset(
		{ type: 'FOLDER', sort: 'thing' },
		{ type: 'FOLDER', parentId: 5 }), 'wrong way with sort on the left');

	ok(!algebra.subset(
		{ type: 'FOLDER' },
		{ type: 'FOLDER', parentId: 5, sort: 'thing' }), 'wrong way with sort on the right');

	ok(!algebra.subset(
		{ type: 'FOLDER', parentId: 7, sort: 'thing' },
		{ type: 'FOLDER', parentId: 5 }), 'different values with sort on the left');

	ok(!algebra.subset(
		{ type: 'FOLDER', parentId: 7 },
		{ type: 'FOLDER', parentId: 5, sort: 'thing' }), 'different values with sort on the right');

});

test('set.subset with range', function(){
	var algebra = new set.Algebra(comparators.sort('sort'),comparators.rangeInclusive('start','end'));

	// add sort .. same .. different
	// add range .. same ... more ... less
	// same
	// right
	// left
	var addSort = function(set, value){
		set.sort = value;
	};

	var sort = {
		left: function(setA, setB) {
			addSort(setA, "prop");
		},
		right: function(setA, setB) {
			addSort(setB, "prop");
		},
		same: function(setA, setB) {
			addSort(setA, "prop");
			addSort(setB, "prop");
		},
		different: function(setA, setB) {
			addSort(setA, "propA");
			addSort(setB, "propB");
		}
	};
	var addRange = function(set, start, end) {
		set.start = start;
		set.end = end;
	};

	var range = {
		left: function(setA,setB){
			addRange(setA, 0,9);
		},
		right: function(setA,setB){
			addRange(setB, 0,9);
		},
		same: function(setA,setB){
			addRange(setA, 0,9);
			addRange(setB, 0,9);
		},
		superLeft: function(setA,setB){
			addRange(setA, 0,9);
			addRange(setB, 3,7);
		},
		superRight: function(setA,setB){
			addRange(setB, 0,9);
			addRange(setA, 3,7);
		}
	};

	var sets = {
		same: function(setA, setB){ },
		superLeft: function(setA, setB){
			setB.type = "apples";
		},
		superRight: function(setA, setB){
			setA.type = "apples";
		}
	};


	var make = function(){
		var setA = {},
			setB = {};
		h.each(arguments, function(method){
			method(setA, setB);
		});
		return {left: setA, right: setB};
	};
	var assertSubset = function(methods, result){
		var sets = make.apply(null, methods);
		equal( algebra.subset(sets.left, sets.right), result, JSON.stringify(sets.left)+" ⊂ "+JSON.stringify(sets.right)+" = "+result );
	};

	assertSubset([sets.superRight, range.right, sort.right], false);
	assertSubset([sets.same, range.same, sort.different], false);
	assertSubset([sets.same, range.same, sort.same], true);

	assertSubset([sets.same, range.superRight, sort.left], false);
	assertSubset([sets.same, range.superRight, sort.same], true);
});

test("set.index", function(){
	var algebra = new set.Algebra(comparators.sort('sort'));

	var index = algebra.index(
		{sort: "name"},
		[{id: 1, name:"g"}, {id: 2, name:"j"}, {id: 3, name:"m"}, {id: 4, name:"s"}],
		{name: "k"});
	equal(index, 2);
});
