/**
 * @module {can.Map} bitballs/models/game Game
 * @parent bitballs.clientModels
 */
var Map = require('can/map/');
var superMap = require('can-connect/can/super-map/');
var set = require("can-set");
var tag = require('can-connect/can/tag/');
var Team = require("bitballs/models/team");
var Player = require("bitballs/models/player");
var Stat = require("bitballs/models/stat");
var Tournament = require("./tournament");
require("can/list/sort/");

var Game = Map.extend({
	roundNames: ["Round 1","Round 2","Round 3","Round 4","Round 5",
		"Elimination", "Quarter Finals","Semi Finals","Championship"]
},{
	define: {
		tournamentId: {type: "number"},
		tournament: {Type: Tournament},

		homeTeamId: {type: "number"},
		awayTeamId: {type: "number"},
		homeTeam: {
			Type: Team
		},
		awayTeam: {
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
			Type: Stat.List,
			set: function(newVal){
				newVal.__listSet = {where: {gameId: this.attr("id")}};
				return newVal;
			}
		},
		videoUrl: {
			set: function (setVal) {
				var youtubeKeySearchPattern =
					/^.*(?:youtu.be\/|v\/|e\/|u\/\w+\/|embed\/|v=)([^#\&\?]*).*/;
				var keys = setVal && setVal.match(youtubeKeySearchPattern);

				// Use the found video key; Fallback to the raw input
				var videoUrl = (keys && keys.length > 1 && keys[1]) || setVal;
				return videoUrl;
			}
		}
	},
	statsForPlayerId: function(id) {
		if(typeof id === "function") {
			id = id();
		}
		return this.attr("stats").filter(function(stat){
			return stat.attr("playerId") === id;
		});
	},
	sortedStatsByPlayerId: function(){
		if(this.attr("stats")) {
			var playerIds = {};
			this.attr("stats").each(function(stat){
				var id = stat.attr("playerId");
				var stats = playerIds[id];
				if(!stats) {
					stats = playerIds[id] = new can.List([]).attr("comparator",'time');
				}
				// makes sort work
				stats.push(stat);
			});
			return playerIds;
		}
	}

});
Game.List = can.List.extend({Map: Game},{});

Game.algebra = new set.Algebra(
	new set.Translate("where","where"),
	set.comparators.sort('sortBy')
);

var gameConnection = superMap({
  Map: Game,
  List: Game.List,
  url: "/services/games",
  name: "game",
  algebra: Game.algebra
});

tag("game-model", gameConnection);

module.exports = Game;
