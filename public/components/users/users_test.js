import QUnit from 'steal-qunit';
import { ViewModel } from './users';

// ViewModel unit tests
QUnit.module('bitballs/components/users');

QUnit.test('Has message', function(){
  var vm = new ViewModel();
  QUnit.equal(vm.attr('message'), 'This is the users-admin component');
});
