import fixture from 'can-fixture';
import $ from 'jquery';
import can  from 'can-util';

export const tournaments = {
    data: [
        {
            date: new Date("Fri Sep 04 2015 07:42:58 GMT-0500 (CDT)"),
            id: 2,
            tournamentId: 1,
            name: "EBaller Virus",
            color: "Yellow",
            player1Id: 1,
            player2Id: 2,
            player3Id: 3,
            player4Id: 5
        }
    ]
};

export const defineFixtures = function () {
    fixture('POST /services/tournaments', function (req) {
        var data = can.extend({}, req.data, {
            date: new Date(req.data.date),
            id: tournaments.data[tournaments.data.length - 1].id + 1
        });

        tournaments.data.push(data);
        return data;
    });

    fixture('POST /services/tournaments', function(req, response){
        if(!req.data.date){
            response(400, '{type: "Bad Request", message: "Can not create a tournament without a date"}');
        } else {
            response({
                id: 3
            });
        }
    });

    fixture('GET /services/tournaments', function (req) {
        return tournaments;
    });

    fixture('GET /services/tournaments/{id}', function (req) {
        var data;
        $.each(tournaments.data, function (i, tourney) {
            if (tourney.id === parseInt(req.data.id, 10)) {
                data = tourney;
                return false;
            }
        });
        return data;
    });
};

defineFixtures();

export default defineFixtures;
