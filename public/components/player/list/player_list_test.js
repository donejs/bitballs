var QUnit = require("steal-qunit");
var Player = require("bitballs/models/player");
var PlayerList = require("./list");
var defineFixtures = require("bitballs/models/fixtures/players").defineFixtures;
var F = require('funcunit');
var fixture = require('can-fixture');

F.attach(QUnit);

var vm;
QUnit.module("Player List Component", {
	beforeEach: function () {
		localStorage.clear();
		defineFixtures();
		vm = new PlayerList.ViewModel();
	},
	afterEach: function () {
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
	var isResolved = false;
	var players = $('player-list', frag).viewModel().attr('players');
	
	$('#qunit-fixture').html(frag);

	players.then(function () {
		isResolved = true;
	});

	F('tbody tr.info')
		.then(function () {
			equal(isResolved, false, 'The list is not resolved');
		})
		.exists('Loading element is present')
		.text('Loading', 'Loading message is shown')
		.wait(fixture.delay) // Wait for the fixture to resolve
		.then(function () {
			equal(isResolved, true, 'The list is resolved');
		})
		.closest('tbody')
		.size(0, 'Loading element was removed');
});

QUnit.test('Placeholder message shown when player list is empty', function () {
	var frag = can.stache('<player-list />')();
	var players = $('player-list', frag).viewModel().attr('players');

	$('#qunit-fixture').html(frag);

	// Make the players fixture return an empty list
	fixture('GET services/players', function () {
		return { data: [] };
	});

	F('tbody tr.empty-list-placeholder')
		.wait(fixture.delay) // Wait for the fixture to resolve
		.then(function () {
			return players.then(function (players) {
				equal(players.length, 0, 'The list is empty');
			});
		})
		.exists('Placeholder element is present')
		.text('No Players', 'Placeholder message is shown')
		.then(function () {
			
			// Make the players fixture return its default
			defineFixtures();

			vm.attr('players', Player.getList({}));
		})
		.wait(fixture.delay) // Wait for the fixture to resolve
		.then(function () {
			return players.then(function (players) {
				equal(players.length, 1, 'The list is not empty');
			});
		})
		.closest('tbody')
		.size(0, 'Placeholder element was removed');
});