import can from 'can';
import QUnit from 'steal-qunit';
import "can/view/stache/";
import "./numberToString";

QUnit.module('util/numberToString');

QUnit.test("numberToString helper", function(assert){

	var template = can.view.stache('<input {($value)}="numberToString(~age)">');

	var map = new can.Map({age: 25});

	var frag = template(map);

	assert.equal(frag.firstChild.value, "25");
	assert.equal(map.attr("age"), 25);

	map.attr("age", 33);

	assert.equal(frag.firstChild.value, "33");
	assert.equal(map.attr("age"), 33);

	frag.firstChild.value = "1";

	can.trigger(frag.firstChild, "change");

	assert.equal(frag.firstChild.value, "1");
	assert.equal(map.attr("age"), 1);

});
