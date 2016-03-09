import $ from 'jquery';
import can from 'can';
import 'can/view/stache/stache';
import fixture from 'can-fixture';
import QUnit from 'steal-qunit';
import F from 'funcunit';
import './list';
import defineFixtures from 'bitballs/models/fixtures/tournament';
import './details/test';
import './list_test';

F.attach(QUnit);

QUnit.module('Tournament List', {
    beforeEach: function () {
        localStorage.clear();
        defineFixtures();
    }
});

QUnit.test('Create button is disabled while posting data', function () {
    var expectingRequest = true;
    var requestPromise = new can.Deferred();
    var frag = can.stache('<tournament-list {app-state}="appState" {tournament}="tournament" />')({

        appState: {
            isAdmin: true
        },
        tournament: {
            name: 'Ballderdash',
            date: '01/21/1987'
        }
    });

    fixture('POST /services/tournaments', function (req, res) {
        ok(expectingRequest, 'Request was made');

        // The request should only be made once
        expectingRequest = false;

        // Commit the response so the UI updates
        res({});

        // Continue the tests
        requestPromise.resolve();
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
        .then(requestPromise.then)
        .attr('disabled', undefined,
            'Create button is enabled after the request is resolved');
});