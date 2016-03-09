import QUnit from 'steal-qunit';
import tournlist from './list';

import fixture, { tournamentData } from 'bitballs/models/fixtures/tournament';

var ViewModel = tournlist.ViewModel;

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