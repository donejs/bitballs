var bookshelf = require("./bookshelf");

/**
 * @module {bookshelf.Model} models/stat Stat
 * @parent bitballs.serviceModels
 *
 * @group models/stat.properties 0 properties
 *
 * @signature `new Stat(properties)`
 *   Creates an instance of a model.
 *
 *   @param {Object} properties Initial values for this model's properties.
 */

var Stat = bookshelf.Model.extend(
/** @prototype **/
{
	/**
	 * @property {String<"stats">} models/stat.properties.tableName tableName
	 * @parent models/stat.properties
	 *
	 * Indicates which database table Bookshelf.js will query against.
	 **/
	tableName: 'stats',
	/**
	 * @function
	 *
	 * Informs Bookshelf.js that the `game` property will be a [models/game]
	 * model with an `id` that matches the `gameId` specified in the query.
	 **/
	game: function(){
		var Game = require("./game");
		return this.belongsTo(Game,"gameId");
	},
	/**
	 * @function
	 *
	 * Informs Bookshelf.js that the `player` property will be a [models/player]
	 * model with an `id` that matches the `playerId` specified in the query.
	 **/
	player: function(){
		var Player = require("./player");
		return this.belongsTo(Player,"playerId");
	},
	/**
	 * @function
	 *
	 * Informs Bookshelf.js that the `creator` property will be a [models/user]
	 * model with an `id` that matches the `creatorId` specified in the query.
	 **/
	creator: function() {
		var User = require("./user");
		return this.belongsTo(User, "creatorId");
	}
});

module.exports = Stat;
