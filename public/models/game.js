/**
 * @module {can.Map} bitballs/models/game Game
 * @parent bitballs.clientModels
 */
var superMap = require('can-connect/can/super-map/');
var set = require("can-set");
var tag = require('can-connect/can/tag/');
var Team = require("bitballs/models/team");
var Player = require("bitballs/models/player");
var Stat = require("bitballs/models/stat");
var Tournament = require("./tournament");
var CanMap = require("can/map/");
var List = require("can/list/");
var can = require("can/util/");

require("can/list/sort/");
require('can/map/define/');


var Game = CanMap.extend(
/** @static */
{
	/**
	 * @property {Array<String>}
	 * An array of possible court names.
	 */
	courtNames: ["1", "2", "3", "4"],
	/**
	 * @property {Array<String>}
	 * An array of possible round names in order.
	 */
	roundNames: ["Round 1", "Round 2", "Round 3", "Round 4", "Round 5",
		"Elimination", "Quarter Finals", "Semi Finals", "Championship"],
	/**
	 * @property {Object<String,Number>}
	 * An object of a round name to its index.
	 */
	roundToIndexMap: {}
},
/** @prototype */
{
	define: {
		/**
		 * @property {Number}
		 * The tournament's id the game belongs to.
		 */
		tournamentId: {type: "number"},
		/**
		 * @property {bitballs/models/tournament}
		 * The tournament the game belongs to.  This can be loaded with `withRelated[]=tournament`.
		 */
		tournament: {Type: Tournament},
		/**
		 * @property {Number}
		 * The home team's id.
		 */
		homeTeamId: {type: "number"},
		/**
		 * @property {Number}
		 * The away team's id.
		 */
		awayTeamId: {type: "number"},
		/**
		 * @property {bitballs/models/team}
		 * The home team. This can be loaded with `withRelated[]=homeTeam`.
		 */
		homeTeam: {
			Type: Team
		},
		/**
		 * @property {bitballs/models/team}
		 * The away team. This can be loaded with `withRelated[]=awayTeam`.
		 */
		awayTeam: {
			Type: Team
		},
		/**
		 * @property {bitballs/models/team.static.List}
		 * A list that contains the home and away team.
		 */
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
		/**
		 * @property {bitballs/models/player.static.List}
		 * A list that contains all players for this game.
		 */
		players: {
			get: function(){
				var players = [];
				this.attr("teams").forEach(function(team){
					[].push.apply(players, can.makeArray( team.attr("players") ) );
				});
				return new Player.List(players);
			}
		},
		/**
		 * @property {bitballs/models/stat.static.List}
		 * The stats for this game. This can be loaded with `withRelated[]=stats`.
		 */
		stats: {
			Type: Stat.List,
			set: function(stats){
				stats.__listSet = {where: {gameId: this.attr("id")}};
				return stats;
			}
		},
		/**
		 * @property {String}
		 * The videoUrl code for the game.  When set to an actual URL, it will
		 * extract the youtube code from the url.
		 */
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
		/**
		 * @property {Number} id
		 * A unique identifier.
		 **/
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

// Cache a static map of round names to round indices
Game.roundNames.forEach(function(roundName, index){
  Game.roundToIndexMap[roundName] = index;
});


/**
 * @constructor {can.List} bitballs/models/game.static.List List
 * @parent bitballs/models/game.static
 */
Game.List = List.extend({Map: Game},
/** @prototype */
{
	define: {
		/**
		 * @property {Object<roundName,Object<courtName,bitballs/models/game>>}
		 * An object that maps round names to court names to games.
		 */
		gamesGroupedByRound: {
			type: '*',
			get: function() {
				var rounds = {};

				this.each(function (game) {
					var roundName = game.attr('round');
					var courtName = game.attr('court');

					// Get, or define the Round pseudo-model
					rounds[roundName] = rounds[roundName] || {
						_count: 0
					};

					// Store the game and increment the count
					rounds[roundName][courtName] = game;
					rounds[roundName]._count++;
				});

				return rounds;
			}
		},
	},
	/**
	 * @function
	 *
	 * @param {String} roundName
	 * @return {Array<String>}
	 */
	getGameCountForRound: function (roundName) {
		var gamesGroupedByRound = this.attr("gamesGroupedByRound"),
			round = gamesGroupedByRound[roundName];
		return round ? round._count : 0;
	},
	/**
	 * @function
	 *
	 * Returns a sorted array of the rounds that have not been filled with games.
	 *
	 * @return {Array<String>}
	 */
	getAvailableRounds: function() {
		return Game.roundNames.filter(function (roundName) {
			return this.getGameCountForRound(roundName) < Game.courtNames.length;
		}, this);
	},
	getRoundsWithGames: function() {
		return Game.roundNames.filter(function (roundName) {
			return this.getGameCountForRound(roundName) > 0;
		}, this);
	},
	/**
	 * @function
	 * Returns a sorted array of the courts that have not been filled for the given round.
	 * @param {String} roundName
	 * @return {Array<String>}
	 */
	getAvailableCourts: function(roundName) {
		return Game.courtNames.filter(function (courtName) {
			return !this.getGameForRoundAndCourt(roundName, courtName);
		}, this);
	},
	/**
	 * @function
	 */
	getGameForRoundAndCourt: function(roundName, court) {
		var gamesGroupedByRound = this.attr("gamesGroupedByRound"),
			round = gamesGroupedByRound[roundName];
		return round && round[court];
	}
});

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
