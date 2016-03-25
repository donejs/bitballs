require("steal-qunit");

var set = require('./set');

QUnit.module("set");


test('set.Algebra constructors', function(){
	var algebra = new set.Algebra(
		set.comparators.rangeInclusive("start", "end"),
		set.comparators.boolean('completed'),
		set.comparators["enum"]('type',['new','prep','deliver','delivered'])
	);

	var res = algebra.subset({ type: ['new'] },{type: ['new','prep']});
	deepEqual(res, true, "enum");

});



