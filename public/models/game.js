var Map = require('can/map/');
var superMap = require('can-connect/can/super-map/');
var tag = require('can-connect/can/tag/');

var Game = Map.extend({
	roundNames: ["Round 1","Round 2","Round 3","Round 4","Round 5",
		"Elimination", "Quarter Finals","Semi Finals","Championship"]
},{
	define: {
		tournamentId: {type: "number"},
		homeTeamId: {type: "number"},
		awayTeamId: {type: "number"}
	}
});
Game.List = can.List.extend({Map: Game},{});

var gameConnection = superMap({
  Map: Game,
  List: Game.List,
  url: "/services/games",
  name: "game"
});

tag("game-model", gameConnection);

module.exports = Game;