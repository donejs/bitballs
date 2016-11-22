import QUnit from 'steal-qunit';
import user from 'bitballs/components/user/details/';
import 'bitballs/models/fixtures/users';

var ViewModel = user.ViewModel;

QUnit.module('components/user/', {
	beforeEach: function() {
	}
});

QUnit.test('create new user', function(assert) {
	assert.expect(5);
	var done = assert.async();

	var vm = new ViewModel();

	vm.user.set({
		email: 'test@bitovi.com',
		password: '123'
	});

	// session is not created before user is saved:
	assert.ok(vm.user.isNew(), 'User should be new.');
	
	assert.equal(vm.session, null, 'Session should not exist before user gets created.');

	vm.saveUser().then(function(){
		assert.equal(vm.session.user.email, 'test@bitovi.com', 'Session email should be set after user gets created.');
		assert.notOk(vm.user.isNew(), 'User should not be new any more.');
		assert.equal(vm.user.password, '', 'User\'s password property should be cleared after user gets created/updated.');

		done();
	}, function() {
		done();
	});
});

QUnit.test('saveUser without password fails', function(assert) {
	var done = assert.async();

	var vm = new ViewModel();


	vm.user.email = 'test@bitovi.com';
	assert.expect(2);

	vm.saveUser();
	vm.savePromise.then(function(resp, type){
		done();
	}, function(resp) {
		assert.equal(resp.statusText, 'error', 'fail creation without password');
		assert.equal(resp.status, 400, 'rejected');
		done();
	});

});
