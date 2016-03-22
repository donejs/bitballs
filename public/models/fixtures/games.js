import fixture from "can-fixture";

export const games = {
    id: 1,
    videoUrl: "AEUULIs_UWE",
    homeTeamId: 1,
    round: "Round 1",
    tournament: {
        id: 1,
        date: "2012-01-01"
    },
    finalScore: {
        home: 22,
        away: 20
    },
    currentScore: {
        home: 0,
        away: 0
    },
    homeTeam: {
        id: 1,
        player1Id:1,
        name: "Solid as A Rock",
        color: "I Blue Myself",
        player1:{
            id: 1,
            name: "George Bluth",
            weight: 180,
            height: 60,
            birthday: "14/11/1960",
            profile: "This is a player",
            startRank: ""
        },
        player2Id:2,
        player2:{
            id: 2,
            name: "Micheal Bluth",
            weight: 180,
            height: 60,
            birthday: "14/11/1960",
            profile: "This is a player",
            startRank: ""
        },
        player3Id:3,
        player3:{
            id: 3,
            name: "Lucille Bluth",
            weight: 180,
            height: 60,
            birthday: "14/11/1960",
            profile: "This is a player",
            startRank: ""
        },
        player4Id:4,
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
    awayTeamId: 2,
    awayTeam: {
        id: 2,
        player1Id:5,
        name: "Bob Loblaw Balls, Y'all",
        color: "Tobias's Favorite Shade of Pink",
        player1:{
            id: 5,
            name: "Lucille Two",
            weight: 180,
            height: 60,
            birthday: "14/11/1960",
            profile: "This is a player",
            startRank: ""
        },
        player2Id:6,
        player2:{
            id: 6,
            name: "Anne",
            weight: 180,
            height: 60,
            birthday: "14/11/1960",
            profile: "This is a player",
            startRank: ""
        },
        player3Id:7,
        player3:{
            id: 7,
            name: "Bob Loblaw",
            weight: 180,
            height: 60,
            birthday: "14/11/1960",
            profile: "This is a player",
            startRank: ""
        },
        player4Id:8,
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
        playerId: 4,
        time: 20
    },
    {
        id: 2,
        type: "2P",
        playerId: 4,
        time: 40
    },
    {
        id: 3,
        type: "1P",
        playerId: 5,
        time: 60
    },
    {
        id: 4,
        type: "1P",
        playerId: 6,
        time: 80
    },
    {
        id: 5,
        type: "1P",
        playerId: 7,
        time: 100
    },
    {
        id: 6,
        type: "2P",
        playerId: 8,
        time: 120
    }]
};

export const defineFixtures = function () {

    fixture('/services/games', function () {
        return {
            data: [games]
        };
    });

    fixture("/services/games/{id}", function(request, response) {
        if (request.data.id === "1" || request.data.id === 1) {
            response(games);
        }
    });

    fixture('GET /services/stats', function () {
        return { data: games.stats };
    });

    fixture('DELETE /services/stats/{id}', function () {
        return {};
    });
};

defineFixtures();

export default defineFixtures;
