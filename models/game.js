var bookshelf = require("../models/bookshelf");
var Stat = require("./stat");
var Team = require("./team");
var Tournament = require("./tournament");

/**
 * @module {bookshelf.Model} models/game Game
 * @parent bitballs.serviceModels
 *
 * @group models/game.properties 0 properties
 *
 * @signature `new Game(properties)`
 *   Creates an instance of a model.
 *
 *   @param {Object} properties Initial values for this model's properties.
 */

var Game = bookshelf.Model.extend(
/** @prototype **/
{
	/**
	 * @property {String<"games">} models/game.properties.tableName tableName
	 * @parent models/game.properties
	 *
	 * Indicates which database table Bookshelf.js will query against.
	 **/
	tableName: 'games',
	/**
	 * @function
	 *
	 * Informs Bookshelf.js that the `stats` property will be a list of
	 * [models/stat] models with a `gameId` that
	 * matches the `id` specified in the query.
	 **/
	stats: function(){
		return this.hasMany(Stat,"gameId");
	},
	/**
	 * @function
	 *
	 * Informs Bookshelf.js that the `homeTeam` property will be a [models/team]
	 * model with an `id` that matches the `homeTeamId` specified in the query.
	 **/
	homeTeam: function(){
		return this.belongsTo(Team,"homeTeamId");
	},
	/**
	 * @function
	 *
	 * Informs Bookshelf.js that the `awayTeam` property will be a [models/team]
	 * model with an `id` that matches the `awayTeamId` specified in the query.
	 **/
	awayTeam: function(){
		return this.belongsTo(Team,"awayTeamId");
	},
	/**
	 * @function
	 *
	 * Informs Bookshelf.js that the `homeTeam` property will be a [models/tournament]
	 * model with an `id` that matches the `tournamentId` specified in the query.
	 **/
	tournament: function(){
		return this.belongsTo(Tournament, "tournamentId");
	}
});

module.exports = Game;
