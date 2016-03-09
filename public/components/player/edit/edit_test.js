import can from 'can';
import QUnit from 'steal-qunit';
import playerEdit from 'bitballs/components/player/edit/edit';
import Player from 'bitballs/models/player';
import F from 'funcunit';
import route from "can/route/";
import Session from "bitballs/models/session";

import 'bitballs/models/fixtures/players';

var ViewModel = playerEdit.ViewModel;

F.attach(QUnit);

// viewmodel unit tests
QUnit.module('player/edit', function(hooks){

	hooks.beforeEach(function(){
		localStorage.clear();
	});

	QUnit.module('ViewModel', function(){

		QUnit.test('Tests are running', function(assert){
			assert.ok( true, "Passed!" );
		});

		var vm = new ViewModel();
		QUnit.test('Can create new ViewModel', function(assert){
			assert.ok( !!vm , "Passed!" );
		});

		vm.bind("saved", function(){
			player.id = 1;
			assert.deepEqual(player, playerModel.attr(),  "New player saved");
			vm.unbind("saved");
			done();
		});
		vm.savePlayer()

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

			vm.savePlayer()
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
			vm.savePlayer()
			
		});

		vm.bind("canceled", function(){
			assert.ok(true, "Event triggered");
			done();
		});

	});

	QUnit.module('Component', function(hooks){
		hooks.beforeEach(function(){
			var template = can.stache('<player-edit player-id=""></player-edit>');

			$('#qunit-fixture').html(template({
				session: {
					isAdmin: true
				}
			}));
		});

		QUnit.test("Height and weight default to empty instead of numbers", function(assert){
			assert.equal($('#player-height').val(), '', "Player height displays as empty string");
			assert.equal($('#player-weight').val(), '', "Player weight displays as empty string");
		});
	});
	QUnit.test('Form is only shown to admins', function () {
		var session = new Session({
			user: {
				isAdmin: false
			}
		});
	
		var frag = can.stache('<player-edit />')({
			session: session
		});
	
		$('#qunit-fixture').html(frag);
	
		F('player-edit .edit-form')
			.missing('Edit form is excluded for non-admin user')
			.then(function () {
				session.attr('user', {
					isAdmin: true
				});
			})
			.exists('Edit form is included for admin user');
	});

});
