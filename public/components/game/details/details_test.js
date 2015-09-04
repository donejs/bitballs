import QUnit from "steal-qunit";
import Session from "models/session";
import details from "./details";
import fixtureContent from "models/fixtures/games";

var DetailsViewModel = details.ViewModel;

QUnit.module("bitballs/game/details/", {
    setup: function() {
        this.vm = new DetailsViewModel({
            id: 1,
            session: new Session()
        });
    }
});

QUnit.test("loads game data", function() {
    QUnit.stop();

    this.vm.bind("game", function(ev, game) {
        deepEqual(game.attr(), fixtureContent, "fetched game data matches fixture");
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