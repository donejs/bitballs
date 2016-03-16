import QUnit from 'steal-qunit';
import { ViewModel } from './list';

// ViewModel unit tests
QUnit.module('bitballs/components/user/list');

QUnit.test('Has message', function(){
  var vm = new ViewModel();
  QUnit.ok(true, 'Has a test');
});
