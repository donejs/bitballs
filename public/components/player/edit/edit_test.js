import can from 'can';
import QUnit from 'steal-qunit';
import stache from "can/view/stache/";
import 'bitballs/components/player/edit/';
import ViewModel from 'bitballs/components/player/edit/viewmodel';
import Player from 'bitballs/models/player';
import route from "can/route/";
import Session from "bitballs/models/session";

import 'bitballs/models/fixtures/players';

// viewmodel unit tests
QUnit.module('player/edit', function(hooks){

	hooks.beforeEach(function(){
		localStorage.clear();
	});

	QUnit.module('ViewModel');

		QUnit.test('Tests are running', function(assert){
		  assert.ok( true, "Passed!" );
		});

		QUnit.test('Can create new ViewModel', function(assert){
			var vm = new ViewModel();
			
		  assert.ok( !!vm , "Passed!" );
		});


		QUnit.test("Has 'player' property", function(assert){
			var vm = new ViewModel();

			assert.ok( !!vm.attr("player") , "Passed!" );
			
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
				})
				vm.savePlayer()
			
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
				vm.savePlayer()
			
		});

		QUnit.test("Cancel event", function(assert){
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

				vm.bind("canceled", function(){
					assert.ok(true, "Event triggered");
					done();
				});
				vm.cancelEvent();
		});

	QUnit.module('Component', function(hooks){
		hooks.beforeEach(function(){
			var template = can.stache('<player-edit player-id=""></player-edit>');

			$('#qunit-fixture').html(template({}));
		});

		QUnit.test("Height and weight default to empty instead of numbers", function(assert){
			assert.equal($('#player-height').val(), '', "Player height displays as empty string");
			assert.equal($('#player-weight').val(), '', "Player weight displays as empty string");
		});
	});

});