import QUnit from 'steal-qunit';
import { ViewModel } from './details';

// ViewModel unit tests
QUnit.module('bitballs/components/player/details');

QUnit.test('Has message', function(){
  var vm = new ViewModel();
  QUnit.equal(vm.message, 'This is the player-details component');
});
