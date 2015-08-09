var Map = require('can/map/');
var superMap = require('can-connect/can/super-map/');
var tag = require('can-connect/can/tag/');
var Team = require("./team");
var Player = require("./player");
var Stat = require("./stat");

var Game = Map.extend({
	roundNames: ["Round 1","Round 2","Round 3","Round 4","Round 5",
		"Elimination", "Quarter Finals","Semi Finals","Championship"]
},{
	define: {
		tournamentId: {type: "number"},
		homeTeamId: {type: "number"},
		
		awayTeamId: {type: "number"},
		
		homeTeam: {
			get: function(lastSet){
				if(lastSet) {
					return lastSet;
				}
			},
			Type: Team
		},
		awayTeam: {
			get: function(lastSet){
				if(lastSet) {
					return lastSet;
				}
			},
			Type: Team
		},
		teams: {
			get: function(){
				
				var teams = [],
					home = this.attr("homeTeam"),
					away = this.attr("awayTeam");
				
				if(home) {
					teams.push(home);
				}
				if(away) {
					teams.push(away);
				}
				return new Team.List(teams);
			}
		},
		players: {
			get: function(){
				var players = [];
				this.attr("teams").forEach(function(team){
					[].push.apply(players, can.makeArray( team.attr("players") ) );
				});
				return new Player.List(players);
			}
		},
		stats: {
			get: function(lastSet){
				if(lastSet) {
					return lastSet;
				}
			},
			Type: Stat.List
		}
	},
	statsForPlayerId: function(id) {
		if(typeof id === "function") {
			id = id();
		}
		return this.attr("stats").filter(function(stat){
			return stat.attr("playerId") === id;
		});
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