import QUnit from 'steal-qunit';
import details from './details';
import defineTournamentFixtures from 'bitballs/models/fixtures/tournaments';
import 'bitballs/models/fixtures/players';
import defineGameFixtures  from 'bitballs/models/fixtures/games';
import defineTeamFixtures  from 'bitballs/models/fixtures/teams';
import fixture from "can-fixture";
import Game from 'bitballs/models/game';
import clone from 'steal-clone';
import Map from 'can/map/';
import stache from 'can/view/stache/';
import F from 'funcunit';
import List from 'can/list/';

var ViewModel = details.ViewModel;
var vm;

F.attach(QUnit);

QUnit.module('components/tournament/details/', {
    beforeEach: function (assert) {
        // let done = assert.async();
        localStorage.clear();
        defineTournamentFixtures();
        defineGameFixtures();
        defineTeamFixtures();

       /* clone({
            'bitballs/models/tournament': {
                get() {
                    return Promise.resolve(new Map({
                        name: 'Test Name'
                    }));
                }
            }
        })
        .import('./details')
        .then(({ ViewModel }) => {
            vm = new ViewModel({
                tournamentId: 2
            });
            done();
        });*/
    }
});
/*
QUnit.test('should load a tournament', (assert) => {
    let done = assert.async();
    vm.bind('tournament', function (ev, newVal) {
        assert.equal(newVal.attr('name'), 'Test Name', 'with the correct name' );
        done();
    });
});*/

QUnit.test('The selected round defaults to the first available round', function () {
    var vm = new ViewModel();
    var gamesResponse = { data: [] };

    Game.courtNames.forEach(function (courtName) {
        gamesResponse.data.push({
            round: Game.roundNames[0],
            court: courtName
        });
    });

    fixture('/services/games', function() {
        return gamesResponse;
    });

    QUnit.stop();
    vm.attr('gamesPromise').then(function (games) {
        QUnit.start();
        QUnit.equal(vm.attr('selectedRound'), Game.roundNames[1],
            'The second round is selected');
    });
});

QUnit.test('The selected court defaults to the first available court', function () {
    var vm = new ViewModel();
    var gamesResponse = { data: [{
        round: Game.roundNames[0],
        court: Game.courtNames[0]
    }] };

    fixture('/services/games', function() {
        return gamesResponse;
    });

    QUnit.stop();
    vm.attr('gamesPromise').then(function (games) {
        QUnit.start();
        QUnit.equal(vm.attr('selectedCourt'), Game.courtNames[1],
            'The second court is selected');
    });
});

QUnit.test('Rows are added/removed as games are created/destroyed', function () {
    var frag = stache('<tournament-details {tournament-id}="tournamentId" />')({
            tournamentId: 2
        }), 
        vm = $(frag.firstChild).viewModel(),
        countRows = function () {
            return $('.games-table tbody tr', frag).length;
        };



    QUnit.stop();
    vm.attr('gamesPromise').then(function () {
        

        equal(countRows(), 1, 'A row exists');
        
        vm.attr('selectedRound', Game.roundNames[1]);
        vm.createGame().then(function () {
            equal(countRows(), 2, 'A row was added');

            vm.attr('games.0').destroy(function () {
                equal(countRows(), 1, 'A row was removed');
                QUnit.start();
            });
        });
    });
});