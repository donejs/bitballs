import QUnit from 'steal-qunit';
// import details from './details';
import defineTournamentFixtures from 'bitballs/models/fixtures/tournaments';
import 'bitballs/models/fixtures/players';
import defineGameFixtures  from 'bitballs/models/fixtures/games';
// import fixture from "can-fixture";
// import Game from 'bitballs/models/game';
import clone from 'steal-clone';
// import DefineMap from 'can-define/map/map';

// var ViewModel = details.ViewModel;
var vm;

QUnit.module('components/tournament/details/', {
    beforeEach: function (assert) {
        let done = assert.async();
        localStorage.clear();
        defineTournamentFixtures();
        defineGameFixtures();

        // vm = new ViewModel({
        //     tournamentId: 2
        // });
        // done();

        clone({
            'bitballs/models/tournament': {
                get: function() {
                    return Promise.resolve(new DefineMap('MyMap', {sealed: false}, {
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
        });   
    }
});

QUnit.test('should load a tournament', (assert) => {
    let done = assert.async();
    vm.on('tournament', function (ev, newVal) {
        assert.equal(newVal.name, 'EBaller Virus', 'with the correct name' );
        done();
    });
});

// QUnit.test('The selected round defaults to the first available round', function () {
//     var vm = new ViewModel();
    
//     var gamesResponse = { data: [] };

//     Game.courtNames.forEach(function (courtName) {
//         gamesResponse.data.push({
//             round: Game.roundNames[0],
//             court: courtName
//         });
//     });

//     fixture('/services/games', function() {
//         return gamesResponse;
//     });

//     vm.on("selectedRound", function(){});
//     QUnit.stop();
//     vm.gamesPromise.then(function (games) {
//         QUnit.start();
//         QUnit.equal(vm.selectedRound, Game.roundNames[1],
//             'The second round is selected');
//     });
// });

// QUnit.test('The selected court defaults to the first available court', function () {
//     var vm = new ViewModel();
    
//     var gamesResponse = { data: [{
//         round: Game.roundNames[0],
//         court: Game.courtNames[0]
//     }] };

//     fixture('/services/games', function() {
//         return gamesResponse;
//     });

//     QUnit.stop();
//     vm.on("selectedCourt", function(){});
//     vm.gamesPromise.then(function (games) {
//         QUnit.start();
//         vm.on('selectedCourt', function(){});
//         QUnit.equal(vm.selectedCourt, Game.courtNames[1],
//             'The second court is selected');
//     });
// });
