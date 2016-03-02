import convertToString from './convertToString';
import QUnit from 'steal-qunit';
import can from 'can';

import 'can/map/define/';

QUnit.module('util', function(){


	QUnit.module('util/convertToString', function(hooks){
		hooks.beforeEach(function(){
			this.ConvertMap = can.Map.extend({
				define: {
					num: {
						type: 'number'
					},
					numString: convertToString('num')
				}
			});
		});


		QUnit.test('get and set', function(assert){
			var convertMap = new this.ConvertMap({
				num: 1
			});

			assert.strictEqual(convertMap.attr('num'), 1, 'original property is an integer');
			assert.strictEqual(convertMap.attr('numString'), '1', 'string property is a matching string');
			
			convertMap.attr('num', -1);

			assert.strictEqual(convertMap.attr('num'), -1, 'setting number property');
			assert.strictEqual(convertMap.attr('numString'), '-1', 'setting number property results in matching string');

			convertMap.attr('numString', '24');

			assert.strictEqual(convertMap.attr('numString'), '24', 'setting through string property');	
			assert.strictEqual(convertMap.attr('num'), 24, 'setting string sets the number property');
		});

		QUnit.test('zeroes and empty strings', function(assert){
			var convertMap = new this.ConvertMap({
				num: 1
			});

			convertMap.removeAttr('num');

			assert.strictEqual(convertMap.attr('num'), undefined, 'removing number proprety');
			assert.strictEqual(convertMap.attr('numString'), '', 'removing number property results in empty string');

			convertMap.attr('num', 0);

			assert.strictEqual(convertMap.attr('num'), 0, 'setting number property to zero');
			assert.strictEqual(convertMap.attr('numString'), '0');


			convertMap.attr('numString', '');

			assert.strictEqual(convertMap.attr('numString'), '', 'setting empty string');
			assert.strictEqual(convertMap.attr('num'), undefined, 'setting empty string removes number property');
		});

		QUnit.test('NaN', function(assert){
			var convertMap = new this.ConvertMap({
				num: 1
			});

			convertMap.attr('numString', 'GARBAGE NONSENSE');

			assert.strictEqual(convertMap.attr('num'), undefined, 'setting a garbage string results in removoing number property');
			assert.strictEqual(convertMap.attr('numString'), '', 'setting garbage string results in empty string');
		});
	});
});