import QUnit from 'steal-qunit';
import StatCreate from './create';
import F from "funcunit"

// ViewModel unit tests
QUnit.module('~/components/stat/create');

QUnit.test("preventCreatingStat", function(assert){
    var statCreate = new StatCreate();

    assert.ok( statCreate.preventCreatingStat() );


    statCreate.statType = "1P";
    statCreate.statPlayerId = 1;

    assert.ok(! statCreate.preventCreatingStat() );
});
