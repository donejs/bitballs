var QUnit = require("steal-qunit");
var Player = require("bitballs/models/player");
var PlayerList = require("./list");
require("bitballs/models/fixtures/player");

var vm;
QUnit.module("Player List Component", {
	beforeEach: function () {
		vm = new PlayerList.ViewModel();
	}
});

QUnit.test("players property loads players from server during instantiation", function (assert) {
	var done = assert.async();
	vm.attr("players").then(function (players) {
		assert.ok(players.length, "we got some players");
		done();
	});
});

QUnit.test("editPlayer sets editingPlayer to passed in player", function (assert) {
	var player = { name: "Ryan" };
	vm.editPlayer(player);
	assert.deepEqual(vm.attr("editingPlayer").attr(), player, "editingPlayer was set");
});

QUnit.test("removeEdit removes editingPlayer", function (assert) {
	var player = { name: "Ryan" };
	vm.attr("editingPlayer", player);
	vm.removeEdit();
	assert.notOk(vm.attr("editingPlayer"), "editingPlayer was removed");
});
