import QUnit from 'steal-qunit';
import user from 'bitballs/components/user/details/';
import 'bitballs/models/fixtures/users';

var ViewModel = user.ViewModel;

QUnit.module('components/user/', {
	beforeEach: function() {
	}
});

QUnit.test('saveUser', function(assert) {
	var done = assert.async();

	var vm = new ViewModel();
	vm.attr('user').attr({email: 'test@bitovi.com', password: '123'});

	// session is not created before user is saved:
	assert.ok(vm.attr('user').isNew(), 'User should be new.');
	// todo: skipped test
	// equal(typeof vm.attr('session'), 'undefined', 'Session should not exist before user gets created.');

	vm.saveUser().then(function(){
		assert.equal(vm.attr('session.user.email'), 'test@bitovi.com', 'Session email should be set after user gets created.');
		assert.notOk(vm.attr('user').isNew(), 'User should not be new any more.');
		assert.equal(vm.attr('user.password'), '', 'User\'s password property should be cleared after user gets created/updated.');

		done();
	});
});

QUnit.test('saveUser without password fails', function(assert) {
	var done = assert.async();

	var vm = new ViewModel();

	vm.attr('user').attr({email: 'test@bitovi.com'});

	assert.expect(2);

	vm.saveUser();
	vm.attr('savePromise').fail(function(resp, type){
		assert.equal(type, 'error', 'fail creation without password');
		assert.equal(vm.attr('savePromise').state(), 'rejected');
		done();
	});
});
