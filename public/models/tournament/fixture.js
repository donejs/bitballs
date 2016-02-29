import fixture from 'can/util/fixture/';
import $ from 'jquery';

export const tournamentData = {
    "data": [
        {
            "date": new Date("Fri Sep 04 2015 07:42:58 GMT-0500 (CDT)"),
            "id": 2,
            "tournamentId": 1,
            "name": "EBaller Virus",
            "color": "Yellow",
            "player1Id": 1,
            "player2Id": 2,
            "player3Id": 3,
            "player4Id": 5
        }
    ]
};

export default can.fixture('GET /services/tournaments/{id}', function (req) {
    var data;
    $.each(tournamentData.data, function (i, tourney) {
        if (tourney.id == req.data.id) {
            data = tourney;
            return false;
        }
    });
    return data;
});

export default can.fixture('POST /services/tournaments', function(req, response){
    if(!req.data.date){
        response(400, '{type: "Bad Request", message: "Can not create a tournament without a date"}');
    } else {
        response({
            id: 3
        });
    }
});