var QUnit = require("steal-qunit");

var set = require('src/set-core'),
	comparators = require("src/comparators");

QUnit.module("comparators.boolean");

/*
 * For the boolean comparator, we define sets like so:
 *
 * For a property p, 
 * x ∈ {} | x.p = true
 * 				 x.p = false
 *
 * 
 */
test('boolean set.difference', function() {

	var comparator = comparators.boolean('completed');
	
	/*
	 * x ∈ {} | x.completed = true OR x.completed = false
	 * y ∈ Y | y.completed = true
	 *
	 * z ∈ (X / Y) | y.completed = false
	 */
	var res = set.difference({} , { completed: true }, comparator);
	deepEqual(res, {completed: false}, "inverse of true");

	/*
	 * x ∈ {} | x.completed = true OR x.completed = false
	 * y ∈ Y | y.completed = true
	 *
	 * z ∈ (X / Y) | y.completed = false
	 */
	res = set.difference({}, { completed: false }, comparator);
	deepEqual(res, {completed: true} , "inverse of false");
});

/*
 * x ∈ X | x.completed = true
 * y ∈ Y | y.completed = false
 * c ∈ {} | c.completed = true OR c.completed = false
 *
 * (X U Y) = c
 */
test('boolean set.union', function(){
	var comparator = comparators.boolean('completed');
	var res = set.union({completed: false} , { completed: true }, comparator);
	deepEqual(res, {}, "union of true and false is entire boolean set");
});

/*
 * x ∈ X | x.foo = 'bar'
 * y ∈ Y | y.completed = true
 *
 * f = {foo: 'bar'}
 * fC = {foo: 'bar', completed: true}
 * fNotC = {foo: 'bar', completed: false}
 * c = {completed: true}
 * notC = {completed: false}
 *
 * x = [f, fC, fNotC]
 * y = [fC, c]
 *
 * z ∈ (X U Y) | z.foo = 'bar' AND y.completed = true
 *
 * z = [fC]
 *
 * Only requires that one property is always on an element
 */
test('boolean set.intersection', function(){
	var comparator = comparators.boolean('completed');
	var res = set.intersection({foo: "bar"} , { completed: true }, comparator);
	deepEqual(res, {foo: "bar", completed: true}, "intersection is false (#4)");
});