import QUnit from 'steal-qunit';
import ViewModel from './viewmodel';

import fixture, { tournamentData } from 'bitballs/models/tournament/fixture';

QUnit.module('tournament-list', function(){

	QUnit.test('creating tournament fails without a name', function(assert){
		var done = assert.async();

		assert.expect(2);

		var vm = new ViewModel();

		vm.createTournament();
		vm.attr('savePromise').fail(function(resp, type){
			assert.equal(type, 'error', 'fail creation without date');
			assert.equal(vm.attr('savePromise').state(), 'rejected');
			done();
		});
	});

});