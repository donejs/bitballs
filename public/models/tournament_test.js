import QUnit from "steal-qunit";
import Tournament from './tournament';

QUnit.module('bitballs/models/tournament', {
    setup: function () {
        this.tournament = new Tournament();
    }
});

QUnit.test('Year does not get improperly displayed based on time zone', function () {
    var tournament = this.tournament;

    tournament.attr('date', '2016-01-01');
    QUnit.equal(tournament.attr('year'), '2016');

});
