import QUnit from 'steal-qunit';
import ViewModel from './viewModel';

import fixture, { tournamentData } from 'bitballs/models/tournament/fixture'

QUnit.module('Tournament Details ViewModel', {
    beforeEach: function () {
        localStorage.clear();
    }
});

test('should load a tournament', (assert) => {
    let done = assert.async();
    let vm = new ViewModel({
        tournamentId: 2
    });

    vm.bind('tournament', function (ev, newVal) {
        assert.equal(newVal.attr('name'), tournamentData.data[0].name, 'with the correct name' );
        assert.equal(newVal.attr('year'), tournamentData.data[0].date.getYear() + 1900, 'with the correct year' );
        done();
    });
});
