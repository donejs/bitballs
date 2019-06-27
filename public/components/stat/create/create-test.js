import QUnit from 'steal-qunit';
import { ViewModel } from './create';

// ViewModel unit tests
QUnit.module('~/components/stat/create');

QUnit.test('Has message', function(){
  var vm = new ViewModel();
  QUnit.equal(vm.message, 'This is the stat-create component');
});
