require("steal-qunit");

var set = require('./set-core');

var ignoreProp = function(){ return true; };

QUnit.module("set core");

test('set.equal', function(){
	
	ok(set.equal({
		type: 'FOLDER'
	}, {
		type: 'FOLDER',
		count: 5
	}, {
		count: ignoreProp
	}), 'count ignored');

	ok(set.equal({
		type: 'folder'
	}, {
		type: 'FOLDER'
	}, {
		type: function (a, b) {
			return ('' + a)
					.toLowerCase() === ('' + b)
					.toLowerCase();
		}
	}), 'folder case ignored');

	// Issue #773
	ok(!set.equal(
		{foo: null},
		{foo: new Date()}
	), 'nulls and Dates are not considered the same. (#773)');

	ok(!set.equal(
		{foo: null},
		{foo: {}}
	), 'nulls and empty objects are not considered the same. (#773)');
	
});


test('set.subset', function(){
	
	ok(set.subset({
		type: 'FOLDER'
	}, {
		type: 'FOLDER'
	}), 'equal sets');
	
	ok(set.subset({
		type: 'FOLDER',
		parentId: 5
	}, {
		type: 'FOLDER'
	}), 'sub set');

	
	ok(!set.subset({
		type: 'FOLDER'
	}, {
		type: 'FOLDER',
		parentId: 5
	}), 'wrong way');
	
	
	ok(!set.subset({
		type: 'FOLDER',
		parentId: 7
	}, {
		type: 'FOLDER',
		parentId: 5
	}), 'different values');
	
	
	ok(set.subset({
		type: 'FOLDER',
		count: 5
	}, {
		type: 'FOLDER'
	}, {
		count: ignoreProp
	}), 'count ignored');
	
	
	ok(set.subset({
		type: 'FOLDER',
		kind: 'tree'
	}, {
		type: 'FOLDER',
		foo: true,
		bar: true
	}, {
		foo: ignoreProp,
		bar: ignoreProp
	}), 'understands a subset');
	
	ok(set.subset({
		type: 'FOLDER',
		foo: true,
		bar: true
	}, {
		type: 'FOLDER',
		kind: 'tree'
	}, {
		foo: ignoreProp,
		bar: ignoreProp,
		kind: ignoreProp
	}), 'ignores nulls');

});

test('set.properSubset', function(){
	equal( set.properSubset({foo: "bar"},{}), true );
	equal( set.properSubset({},{}), false );
	equal( set.properSubset({},{foo: "bar"}), false );
});

test('set.difference', function(){
	
	var res = set.difference({}, { completed: true });
	ok(res === true, "diff should be true");
	

	res = set.difference({ completed: true }, { completed: true });
	equal(res, false);
	
	res = set.difference({ completed: true }, {});
	equal(res, false);

	res = set.difference({ completed: true }, { foo: 'bar' });
	equal(res, false);
	
	
});

test('set.difference({ function })', function() {
	var res = set.difference({ colors: ['red','blue'] }, { colors: ['blue'] }, {
		colors: function() {
			return {
				// can’t always be privided … but COULD if we were gods
				difference: ['red' ],
				intersection: ['blue']
			};
		}
	});

	deepEqual(res, { colors: [ 'red' ] });
});

test('set.union', function(){
	
	// set / subset
	/*var res = set.union({}, { completed: true });
	deepEqual(res , {}, "set / subset");
	
	res = set.union({ completed: true }, {});
	deepEqual(res , {}, "subset / set");
	
	res = set.union({foo: "bar"},{foo: "bar"});
	deepEqual(res, {foo: "bar"}, "equal");
	
	res = set.union({foo: "bar"},{foo: "zed"});
	ok(!res, "values not equal");*/
	
	var res = set.union({foo: "bar"},{name: "A"});
	ok(!res, "values not equal");
});

test('set.union Array', function(){
	
	// set / subset
	var res = set.union({foo: ["a","b"]}, { foo: ["a","c"] });
	deepEqual(res , {foo: ["a","b","c"]}, "set / subset");
	
});

test('set.count', function(){
	ok( set.count({}) === Infinity, "defaults to infinity");
	ok( set.count({foo: "bar"},{}) === Infinity, "defaults to infinity");
	
	equal( set.count({foo: "bar"}, {
		foo: function(){
			return {
				count: 100
			};
		}
	}), 100,  "works with a single value"  );
});

test('set.intersection', function(){
	/*var res = set.intersection({}, { completed: true });
	deepEqual(res , { completed: true }, "set / subset");
	
	res = set.intersection({ completed: true }, {});
	deepEqual(res , { completed: true }, "subset / set");
	
	res = set.intersection({foo: "bar"},{foo: "bar"});
	deepEqual(res, {foo: "bar"}, "equal");
	
	res = set.intersection({foo: "bar"},{foo: "zed"});
	ok(!res, "values not equal");*/

	var res = set.intersection({foo: 'bar'},{completed: true});
	deepEqual(res, {foo: 'bar', completed: true}, 'intersection should combine definitions');
});

test('set.intersection Array', function(){
	
	// set / subset
	var res = set.intersection({foo: ["a","b"]}, { foo: ["a","c"] });
	deepEqual(res , {foo: ["a"]}, "intersection");
	
});