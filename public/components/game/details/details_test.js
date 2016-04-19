import QUnit from "steal-qunit";
import Session from "models/session";
import details from "./details";
import { games } from "models/fixtures/games";
import F from 'funcunit';
import stache from 'can/view/stache/';
import fixture from 'can-fixture';
import $ from 'jquery';

var deepEqual = QUnit.deepEqual,
    ok = QUnit.ok,
    notOk = QUnit.notOk;

F.attach(QUnit);

var DetailsViewModel = details.ViewModel;

QUnit.module("bitballs/game/details/", {
    setup: function() {
        localStorage.clear();
        fixture.delay = 1;

        this.vm = new DetailsViewModel({
            gameId: 1,
            session: new Session()
        });
    }
});

QUnit.test("loads game data", function() {
    QUnit.stop();

    this.vm.bind("game", function(ev, game) {
        deepEqual(game.attr(), games, "fetched game data matches fixture");
        QUnit.start();
    });

    this.vm.attr("gamePromise").catch(function(err) {
        ok(false, "game fetch failed");
        QUnit.start();
    });
});

QUnit.test("correctly sums score", function() {
    QUnit.stop();

    var vm = this.vm;
    vm.bind("game", function(ev, game) {
        deepEqual(vm.attr('finalScore'), {
            home: 3,
            away: 5
        });
        QUnit.start();
    });
});

QUnit.test('A stat can only be deleted by an admin', function () {

    var session = new Session({
        isAdmin: false
    });

    var frag = stache('<game-details {game-id}="gameId" {session}="session" />')({
        gameId: this.vm.attr('gameId'),
        session: session
    });

    $('#qunit-fixture').html(frag);

    F.confirm(true);

    F('.stat-point .destroy-btn')
        .size(0, 'There is no destroy button')
        .then(function () {
            session.attr('isAdmin', true);
            ok(true, 'The user is given admin privileges');
        })
        .size(6, 'Destroy buttons are inserted')
        .click()
        .size(5, 'Clicking the destroy button removed a stat');
});


QUnit.test('Deleting a stat does not change playback location', function () {

    var gotoCalled = false;
    var frag = stache('<game-details {game-id}="gameId" {session}="session" />')({
        gameId: this.vm.attr('gameId'),
        session: new Session({
            isAdmin: true
        })
    });

    $('#qunit-fixture').html(frag);

    QUnit.stop();

    var vm = $('game-details').viewModel();

    vm.gotoTimeMinus5 = function () {
        gotoCalled = true;
    };

    vm.bind('game', function(ev, game) {
        QUnit.start();

        F.confirm(true);

        F('.stat-point .destroy-btn')
            .exists('Destroy button exists')
            .click()
            .then(function () {
                notOk(gotoCalled, 'Seek was not called');
            });
    });
});
