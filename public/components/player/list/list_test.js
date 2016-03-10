var QUnit = require("steal-qunit");
var Player = require("bitballs/models/player");
var PlayerList = require("./list");
var defineFixtures = require("bitballs/models/fixtures/players").defineFixtures;
var F = require('funcunit');
var fixture = require('can-fixture');

F.attach(QUnit);

var vm;
QUnit.module("components/player/list/", {
	beforeEach: function () {
		localStorage.clear();
		fixture.delay = 1;
		defineFixtures();
		vm = new PlayerList.ViewModel();
	},
	afterEach: function () {
		defineFixtures();
		vm = undefined;
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

QUnit.test('Loading message shown while players list is loaded', function () {
	var frag = can.stache('<player-list />')();
	var players = $('player-list', frag).viewModel().attr('players');
	var resolveFixture;
	
	$('#qunit-fixture').html(frag);

	fixture('GET /services/players', function (req, res) {
		resolveFixture = res;
	});

	F('tbody tr.info')
		.exists('Loading element is present')
		.text('Loading', 'Loading message is shown')
		.then(function () {
			ok(true, 'Request is resolved');
			resolveFixture({ data: [] });
		})
		.closest('tbody')
		.size(0, 'Loading element was removed');
});

QUnit.test('Placeholder message is shown when player list is empty', function () {
	var frag = can.stache('<player-list />')();

	// Make the players fixture return an empty list
	fixture('GET /services/players', function () {
		return { data: [] };
	});

	$('#qunit-fixture').html(frag);

	F('tbody tr.empty-list-placeholder')
		.exists('Placeholder element is present');
});
