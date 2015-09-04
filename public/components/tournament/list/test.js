import $ from 'jquery';
import QUnit from 'steal-qunit';
import TournamentListVM from './list';

var vm = new TournamentListVM();

QUnit.test('Tournament List', function(assert) {
  vm.bind('tournaments', function(el, newVal, oldVal){
    console.log(newVal);
    console.log(vm.attr('tournaments'));
    console.log(vm.attr());
  });
  assert.ok(1, 1);
});
