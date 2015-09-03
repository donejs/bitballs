import $ from 'jquery';
import QUnit from 'steal-qunit';
import TournamentListVM from './list';

var vm = new TournamentListVM();

QUnit.test('Tournament List', function() {
  
  console.log(vm.attr());
});
