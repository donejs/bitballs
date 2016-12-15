import $ from 'jquery';
import stache from 'can-stache';
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
		fixture.delay = 1;
		defineFixtures();
	}
});

QUnit.test('creating tournament fails without a name', function(assert){
	var done = assert.async();

	assert.expect(2);

	var vm = new ViewModel();

	vm.createTournament();
	vm.savePromise.then(done, function(resp, type){
		assert.equal(resp.statusText, 'error', 'fail creation without date');
		assert.equal(resp.status, '400', 'rejected');
		done();
	});
});

QUnit.test('Create button is disabled while posting data', function (assert) {
	var done = assert.async();
	var expectingRequest = true;
	var vm = new ViewModel({
        app: {
            isAdmin: true
        },
        tournament: {
            name: 'Ballderdash',
            date: '01/21/1987'
        }
    });

	
	var frag = stache('<tournament-list {is-admin}="app.isAdmin" {tournament}="tournament" />')(vm);
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
				.click();
	F('tournament-list .create-btn')
			.attr('disabled', 'disabled', 'Create button is disabled')
			.then(function() {
				resolveRequest({});
			})
			.attr('disabled', undefined,
		'Create button is enabled after the request is resolved');

	done();
});
