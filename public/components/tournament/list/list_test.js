import $ from 'jquery';
import can from 'can';
import 'can/view/stache/stache';
import fixture from 'can-fixture';
import QUnit from 'steal-qunit';
import F from 'funcunit';
import tournamentList from './list';
import defineFixtures from 'bitballs/models/fixtures/tournaments';

F.attach(QUnit);

var ViewModel = tournamentList.ViewModel;

QUnit.module('components/tournament/list/', {
	beforeEach: function () {
		localStorage.clear();
		defineFixtures();
	}
});

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

QUnit.test('Create button is disabled while posting data', function () {
    var expectingRequest = true;
    var frag = can.stache('<tournament-list {is-admin}="app.isAdmin" {tournament}="tournament" />')({
        app: {
            isAdmin: true
        },
        tournament: {
            name: 'Ballderdash',
            date: '01/21/1987'
        }
    });
    var resolveRequest;

    fixture('POST /services/tournaments', function (req, res) {
        QUnit.ok(expectingRequest, 'Request was made');

        // Determine when the request resolves, later
        resolveRequest = res;

        // The request should only be made once
        expectingRequest = false;
    });

    $('#qunit-fixture').html(frag);

    // Click the button multiple times and ensure it's disabled
    // during requests
    F('tournament-list .create-btn')
        .visible('Create button is visible')
        .attr('disabled', undefined, 'Create button is enabled')
        .click()
        .attr('disabled', 'disabled', 'Create button is disabled after click')
        .click()
        .then(function () {
            resolveRequest({});
        })
        .attr('disabled', undefined,
            'Create button is enabled after the request is resolved');
});
