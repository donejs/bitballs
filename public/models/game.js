/**
 * @module {can-map} bitballs/models/game Game
 * @parent bitballs.clientModels
 *
 * @group bitballs/models/game.properties 0 properties
 */
var superMap = require('can-connect/can/super-map/');
var set = require("can-set");
var tag = require('can-connect/can/tag/');
var Team = require("bitballs/models/team");
var Player = require("bitballs/models/player");
var Stat = require("bitballs/models/stat");
var Tournament = require("./tournament");
var DefineMap = require("can-define/map/map");
var DefineList = require("can-define/list/list");
var can = require("can-util");


var Game = DefineMap.extend('Game',
{
	/**
	 * @property {Array<String>}
	 * A sorted array of possible court names.
	 */
	courtNames: ["1", "2", "3", "4"],
	/**
	 * @property {Array<String>}
	 * A sorted array of possible round names.
	 */
	roundNames: ["Round 1", "Round 2", "Round 3", "Round 4", "Round 5",
		"Elimination", "Quarter Finals", "Semi Finals", "Championship"]
},
{
	/**
	 * @property {Number} bitballs/models/game.properties.id id
	 * @parent bitballs/models/game.properties
	 * A unique identifier.
	 **/
	id: 'number',
	/**
	 * @property {Number} bitballs/models/game.properties.tournamentId tournamentId
	 * @parent bitballs/models/game.properties
	 * The tournament's id the game belongs to.
	 */
	tournamentId: "number",
	/**
	 * @property {bitballs/models/tournament} bitballs/models/game.properties.tournament tournament
	 * @parent bitballs/models/game.properties
	 * The tournament the game belongs to.  This can be loaded with `withRelated[]=tournament`.
	 */
	tournament: {
		Type: Tournament
	},
	/**
	 * @property {Number} bitballs/models/game.properties.homeTeamId homeTeamId
	 * @parent bitballs/models/game.properties
	 * The home team's id.
	 */
	homeTeamId: "number",
	/**
	 * @property {Number} bitballs/models/game.properties.awayTeamId awayTeamId
	 * @parent bitballs/models/game.properties
	 * The away team's id.
	 */
	awayTeamId: "number",
	/**
	 * @property {bitballs/models/team} bitballs/models/game.properties.homeTeam homeTeam
	 * @parent bitballs/models/game.properties
	 * The home team. This can be loaded with `withRelated[]=homeTeam`.
	 */
	homeTeam: Team,
	/**
	 * @property {bitballs/models/team} bitballs/models/game.properties.awayTeam awayTeam
	 * @parent bitballs/models/game.properties
	 * The away team. This can be loaded with `withRelated[]=awayTeam`.
	 */
	awayTeam: Team,
	/**
	 * @property {String} bitballs/models/game.properties.round round
	 * @parent bitballs/models/game.properties
	 * 
	 * The game round value
	 */
	round: 'string',
	/**
	 * @property {String} bitballs/models/game.properties.court court
	 * @parent bitballs/models/game.properties
	 * 
	 * The game court value
	 */
	court: 'string',
	/**
	 * @property {bitballs/models/team.static.List} bitballs/models/game.properties.teams teams
	 * @parent bitballs/models/game.properties
	 * A list that contains the home and away team.
	 */
	get teams() {
		var teams = [],
			home = this.homeTeam,
			away = this.awayTeam;

		if(home) {
			teams.push(home);
		}
		if(away) {
			teams.push(away);
		}
		return new Team.List(teams);
	},
	/**
	 * @property {bitballs/models/player.static.List} bitballs/models/game.properties.players players
	 * @parent bitballs/models/game.properties
	 * A list that contains all [bitballs/models/player] models for this game.
	 */
	get players() {
		var players = [];
		this.teams.forEach(function(team){
			[].push.apply(players, can.makeArray( team.players ) );
		});
		return new Player.List(players);
	},
	/**
	 * @property {bitballs/models/stat.static.List} bitballs/models/game.properties.stats stats
	 * @parent bitballs/models/game.properties
	 * The stats for this game. This can be loaded with `withRelated[]=stats`.
	 */
	stats: {
		Type: Stat.List,
		set: function(stats){
			stats.__listSet = {where: {gameId: this.id }};	
			return stats;
		}
	},
	/**
	 * @property {String} bitballs/models/game.properties.videoUrl videoUrl
	 * @parent bitballs/models/game.properties
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
	},
	/**
	 * @function
	 **/
	statsForPlayerId: function(id) {
		// if(typeof id === "function") {
		// 	id = id();
		// }
		return this.stats.filter(function(stat){
			return stat.playerId === id;
		});
	},
	/**
	 * @function
	 **/
	sortedStatsByPlayerId: function(){
		if(this.stats) {
			var playerIds = {};
			this.stats.each(function(stat){
				var id = stat.playerId;
				var stats = playerIds[id];
				if(!stats) {
					stats = new DefineList();
					stats.comparator = 'time';
					playerIds[id] = stats;
				}
				// makes sort work
				stats.push(stat);
			});
			return playerIds;
		}
	}
});

/**
 * @constructor {can-list} bitballs/models/game.static.List List
 * @parent bitballs/models/game.static
 *
 * @group bitballs/models/game.static.List.properties 0 properties
 */
Game.List = DefineList.extend('GamesList', {"#": Game},
{
	/**
	 * @property {Object<roundName,Object<courtName,bitballs/models/game>>} bitballs/models/game.static.List.properties.gamesGroupedByRound gamesGroupedByRound
	 * @parent bitballs/models/game.static.List.properties
	 *
	 * An object that maps round names to court names to [bitballs/models/game] models.
	 */
	get gamesGroupedByRound() {
		var rounds = {};
		this.forEach(function (game) {
			var roundName = game.round;
			var courtName = game.court;

			// Get, or define the Round pseudo-model
			rounds[roundName] = rounds[roundName] || {
				_count: 0
			};

			// Store the game and increment the count
			rounds[roundName][courtName] = game;
			rounds[roundName]._count++;
		});

		return rounds;
	},
	/**
	 * @function
	 *
	 * Reads from the `_count` property for the given `roundName` in
	 * [bitballs/models/game.static.List.properties.gamesGroupedByRound].
	 *
	 * @param {String} roundName
	 * @return {Array<String>}
	 */
	getGameCountForRound: function (roundName) {
		var gamesGroupedByRound = this.gamesGroupedByRound,
			round = gamesGroupedByRound[roundName];
		return round ? round._count : 0;
	},
	/**
	 * @function
	 *
	 * Returns a sorted array of rounds that don't reference a [bitballs/models/game]
	 * in [bitballs/models/game.static.List.properties.gamesGroupedByRound].
	 *
	 * @return {Array<Object>}
	 */
	getAvailableRounds: function() {
		return Game.roundNames.filter(function (roundName) {
			return this.getGameCountForRound(roundName) < Game.courtNames.length;
		}, this);
	},
	/**
	 * @function
	 *
	 * Returns a sorted array of rounds that reference at least one [bitballs/models/game]
	 * in [bitballs/models/game.static.List.properties.gamesGroupedByRound].
	 *
	 * @return {Array<Object>}
	 **/
	getRoundsWithGames: function() {
		var rounds = Game.roundNames.filter(function (roundName) {
			return this.getGameCountForRound(roundName) > 0;
		}, this);
		return rounds;
	},
	/**
	 * @function
	 * Returns a sorted array of courts in [bitballs/models/game.static.List.properties.gamesGroupedByRound]
	 * that don't reference a [bitballs/models/game] for the given `roundName`.
	 * @param {String} roundName
	 * @return {Array<Object>}
	 */
	getAvailableCourts: function(roundName) {
		return Game.courtNames.filter(function (courtName) {
			return !this.getGameForRoundAndCourt(roundName, courtName);
		}, this);
	},
	/**
	 * @function
	 *
	 * Gets a reference to a [bitballs/models/game] in [bitballs/models/game.static.List.properties.gamesGroupedByRound]
	 * using the provided `roundName` and `courtName`.
	 *
	 * @param {String} roundName
	 * @param {String} courtName
	 *
	 * @return {bitballs/models/game}
	 */
	getGameForRoundAndCourt: function(roundName, courtName) {
		var gamesGroupedByRound = this.gamesGroupedByRound,
			round = gamesGroupedByRound[roundName];
		return round && round[courtName];
	}
});

/**
 * @property {set.Algebra} bitballs/models/game.static.algebra algebra
 * @parent bitballs/models/game.static
 *
 * Set Algebra
 */
Game.algebra = new set.Algebra(
	new set.Translate("where","where"),
	set.comparators.sort('sortBy')
);

var gameConnection = superMap({
  Map: Game,
  List: Game.List,
  url: {
		resource: "/services/games",
		contentType: "application/x-www-form-urlencoded"
	},
  name: "game",
  algebra: Game.algebra,
});

tag("game-model", gameConnection);

Game.connection = gameConnection;

module.exports = Game;
