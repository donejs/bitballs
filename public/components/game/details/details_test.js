import QUnit from "steal-qunit";
import Session from "models/session";
import details from "./details";
import fixtureContent from "models/fixtures/games";

var DetailsViewModel = details.ViewModel;

QUnit.module("bitballs/game/details/");

QUnit.test("loads game data", function() {
    QUnit.stop();

    var vm = new DetailsViewModel({
        id: 1,
        session: new Session()
    });

    vm.bind("game", function(ev, game) {
        deepEqual(game.attr(), fixtureContent, "fetched game data matches fixture");
        QUnit.start();
    });

    vm.attr("gamePromise").catch(function(err) {
        ok(false, "game fetch failed");
    });
});