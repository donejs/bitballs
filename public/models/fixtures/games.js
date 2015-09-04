import fixture from "can/util/fixture/";

var responseData = {
    id: 1,
    homeTeam: {
        id: 1,
        player1:{
            id: 1,
            name: "George Bluth",
            weight: 180,
            height: 60,
            birthday: "14/11/1960",
            profile: "This is a player",
            startRank: ""
        },
        player2:{
            id: 2,
            name: "Micheal Bluth",
            weight: 180,
            height: 60,
            birthday: "14/11/1960",
            profile: "This is a player",
            startRank: ""
        },
        player3:{
            id: 3,
            name: "Lucille Bluth",
            weight: 180,
            height: 60,
            birthday: "14/11/1960",
            profile: "This is a player",
            startRank: ""
        },
        player4:{
            id: 4,
            name: "Oscar Bluth",
            weight: 180,
            height: 60,
            birthday: "14/11/1960",
            profile: "This is a player",
            startRank: ""
        }
    },
    awayTeam: {
        id: 2,
        player1:{
            id: 5,
            name: "Lucille Two",
            weight: 180,
            height: 60,
            birthday: "14/11/1960",
            profile: "This is a player",
            startRank: ""
        },
        player2:{
            id: 6,
            name: "Anne",
            weight: 180,
            height: 60,
            birthday: "14/11/1960",
            profile: "This is a player",
            startRank: ""
        },
        player3:{
            id: 7,
            name: "Bob Loblaw",
            weight: 180,
            height: 60,
            birthday: "14/11/1960",
            profile: "This is a player",
            startRank: ""
        },
        player4:{
            id: 8,
            name: "Steve Holt",
            weight: 180,
            height: 60,
            birthday: "14/11/1960",
            profile: "This is a player",
            startRank: ""
        }
    },
    stats: [{
        id: 1,
        type: "1P",
        playerId: 4
    }]
};

fixture("/services/games/{id}", function(request, response) {
    if (request.data.id == "1") {
        response(responseData);
    }
});

export default responseData;