import QUnit from "steal-qunit";
import Stat from './stat';
import stats from 'bitballs/models/fixtures/stats';

QUnit.module('bitballs/models/tournament', {
    setup: function () {
    }
});

QUnit.test('It should return a list of aggregated stats', function () {
    let statList = new Stat.List(stats);
    let aggregatedStats = statList.aggregated;
    QUnit.deepEqual(aggregatedStats[0], {name: '1P', default: "20"});
    QUnit.deepEqual(aggregatedStats[1], {name: '1PA', default: "30"});
    QUnit.deepEqual(aggregatedStats[2], {name: '2P', default: "9"});
});
