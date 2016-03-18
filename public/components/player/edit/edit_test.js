import can from 'can';
import QUnit from 'steal-qunit';
import playerEdit from 'bitballs/components/player/edit/edit';
import Player from 'bitballs/models/player';
import F from 'funcunit';
import $ from "jquery";
import './edit';

import defineFixtures from 'bitballs/models/fixtures/players';

var ViewModel = playerEdit.ViewModel;

F.attach(QUnit);

// viewmodel unit tests
QUnit.module('components/player/edit/', function(hooks){

	hooks.beforeEach(function(){
		localStorage.clear();
		defineFixtures();
	});

	QUnit.test('Tests are running', function(assert){
		assert.ok( true, "Passed!" );
	});

	QUnit.test('Can create new ViewModel', function(assert){
		var vm = new ViewModel();
		vm.attr("player.name","Justin");
		assert.ok( !!vm , "Passed!" );
	});

	QUnit.test("Create player", function(assert){
		assert.expect(1);
		var done = assert.async(),
			player = {
				"name": "Test Player",
				"weight": 200,
				"height": 71,
				"birthday": "1980-01-01"
			},
			playerModel = new Player(player),
			vm = new ViewModel({
				player:playerModel
			});

		vm.bind("saved", function(){
			player.id = 1;
			assert.deepEqual(player, playerModel.attr(),  "New player saved");
			vm.unbind("saved");
			done();
		});
		vm.savePlayer();

	});

	QUnit.test("Create player fails without name", function(assert){
		assert.expect(2);
		var done = assert.async(),
			player = {
				"weight": 200,
				"height": 71,
				"birthday": "1980-01-01"
			},
			playerModel = new Player(player),
			vm = new ViewModel({
				player: playerModel
			});

		vm.savePlayer();
		vm.attr("savePromise").fail(function(resp, type){
			assert.equal(type, 'error', 'fail creation without password');
			assert.equal(vm.attr('savePromise').state(), 'rejected');
			done();
		});
	});

	QUnit.test("Update player", function(assert){
		assert.expect(1);
		var done = assert.async(),
			player = {
				"name": "Test Player",
				"weight": 200,
				"height": 71,
				"birthday": "1980-01-01",
				"id": 1
			},
			playerModel = new Player(player),
			vm = new ViewModel({
				player:playerModel
			});

		//update player info
		vm.attr("player.name", "Test Player (modified)");

		vm.bind("saved", function(){
			player.name = "Test Player (modified)";

			assert.deepEqual(playerModel.attr(), player, "Player updated");
			vm.unbind("saved");
			done();
		});
		vm.savePlayer();

	});

	QUnit.test('Form is only shown to admins', function () {

		var vm = new can.Map({
			isAdmin: false
		});
		var frag = can.stache('<player-edit {is-admin}="isAdmin" />')(vm);

		QUnit.equal($('player-edit .edit-form', frag).length, 0,
			'Form is excluded for non-admin user');

		vm.attr('isAdmin', true);

		QUnit.equal($('player-edit .edit-form', frag).length, 1,
			'Form is included for admin user');
	});

	QUnit.test('Properties are restored when canceled', function (assert) {
		var initialName = 'Chris Gomez';
		var initialWeight = 175;
		var initialHeight = 69;
		var editedName = 'Alfred Hitchcock';
		var editedWeight = 210;
		var editedHeight = 67;

		var vm = new ViewModel({
			player: {
				name: initialName,
				weight: initialWeight,
				height: initialHeight
			}
		});

		var player = vm.attr('player');

		assert.equal(player.attr('name'), initialName, 'Initial name is correct');
		assert.equal(player.attr('weight'), initialWeight, 'Initial weight is correct');
		assert.equal(player.attr('height'), initialHeight, 'Initial height is correct');

		player.attr({
			name: editedName,
			weight: editedWeight,
			height: editedHeight
		});

		assert.equal(player.attr('name'), editedName, 'Edited name is correct');
		assert.equal(player.attr('weight'), editedWeight, 'Edited weight is correct');
		assert.equal(player.attr('height'), editedHeight, 'Edited height is correct');

		vm.cancel();

		assert.equal(player.attr('name'), initialName, 'Restored name is correct');
		assert.equal(player.attr('weight'), initialWeight, 'Restored weight is correct');
		assert.equal(player.attr('height'), initialHeight, 'Restored height is correct');
	});

});
