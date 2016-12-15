import QUnit from 'steal-qunit';
import stache from "can-stache";
import "./numberToString";
import DefineMap from 'can-define/map/map';

QUnit.module('util/numberToString');

QUnit.test("numberToString helper", function(assert){

	var template = stache('<input {($value)}="numberToString(~age)">');

	var map = new DefineMap({age: 25});

	var frag = template(map);

	assert.equal(frag.firstChild.value, "25");
	assert.equal(map.age, 25);
	
	setTimeout(function(){
		map.attr('age',  33);

		assert.equal(frag.firstChild.value, "33");
		assert.equal(map.age, 33);

		var event;
		event = document.createEvent("HTMLEvents");
		event.initEvent("change", true, true);

		frag.firstChild.value = '1';
		frag.firstChild.dispatchEvent(event);

		assert.equal(frag.firstChild.value, "1");
		assert.equal(map.age, 1);
	}, 2000);



});
