import QUnit from "steal-qunit";
import Player from "bitballs/models/player";
import { ViewModel } from "./list";
import defineFixtures from "bitballs/models/fixtures/players";
import F from "funcunit";
import { fixture, stache } from "can";
import $ from "jquery";

F.attach(QUnit);

var vm;
QUnit.module("components/player/list/", {
	beforeEach: function () {
		localStorage.clear();
		fixture.delay = 1;
		defineFixtures();
		vm = new ViewModel();
	},
	afterEach: function () {
		defineFixtures();
		vm = undefined;
	}
});

QUnit.test("players property loads players from server during instantiation", function (assert) {
	var done = assert.async();
	vm.playersPromise.then(function (players) {
		assert.ok(players.length, "we got some players");
		done();
	});
});

QUnit.test("editPlayer sets editingPlayer to passed in player", function (assert) {
	var player = new Player({ name: "Ryan" });
	vm.editPlayer(player);
	assert.deepEqual(vm.editingPlayer, player, "editingPlayer was set");
});

QUnit.test("removeEdit removes editingPlayer", function (assert) {
	var player = { name: "Ryan" };
	vm.editingPlayer = player;
	vm.removeEdit();
	assert.notOk(vm.editingPlayer, "editingPlayer was removed");
});

QUnit.test('Loading message shown while players list is loaded', function (assert) {
	var frag = stache('<player-list />')();

	var resolveFixture;

	$('#qunit-fixture').html(frag);

	fixture('GET /services/players', function (req, res) {
		resolveFixture = res;
	});

	F('tbody tr.info')
		.exists('Loading element is present')
		.text('Loading', 'Loading message is shown')
		.then(function () {
			assert.ok(true, 'Request is resolved');
			resolveFixture({ data: [] });
		})
		.closest('tbody')
		.size(0, 'Loading element was removed');
});

QUnit.test('Placeholder message is shown when player list is empty', function () {
	var frag = stache('<player-list />')();

	// Make the players fixture return an empty list
	fixture('GET /services/players', function () {
		return { data: [] };
	});

	$('#qunit-fixture').html(frag);

	F('tbody tr.empty-list-placeholder')
		.exists('Placeholder element is present');
});
