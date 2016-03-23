var bookshelf = require("../models/bookshelf");
var Player = require("./player");
var checkit = require('checkit');

/**
 * @module {bookshelf.Model} models/team Team
 * @parent bitballs.serviceModels
 *
 * @group models/team.properties 0 properties
 *
 * @signature `new Team(properties)`
 *   Creates an instance of a model.
 *
 *   @param {Object} properties Initial values for this model's properties.
 */

var Team = bookshelf.Model.extend(
/** @prototype **/
{
	/**
	 * @property {String<"teams">} models/team.properties.tableName tableName
	 * @parent models/team.properties
	 *
	 * Indicates which database table Bookshelf.js will query against.
	 **/
	tableName: 'teams',
	initialize: function(){
		this.on('saving', this.validateSave);
	},
	/**
	 * @function
	 * 
	 * Validates fields and produces informative error messages
	 * if the team can not be saved.
	 */
	validateSave: function(){
		return checkit({
			player1Id: {rule: 'required', message: 'Player 1 is required'},
			player2Id: {rule: 'required', message: 'Player 2 is required'},
			player3Id: {rule: 'required', message: 'Player 3 is required'},
			player4Id: {rule: 'required', message: 'Player 4 is required'}
		}).run(this.attributes);
	},
	/**
	 * @function
	 *
	 * Informs Bookshelf.js that the `player1` property will be a [models/player]
	 * model with an `id` that matches the `player1Id` specified in the query.
	 **/
	player1: function(){
		return this.belongsTo(Player,"player1Id");
	},
	/**
	 * @function
	 *
	 * Informs Bookshelf.js that the `player2` property will be a [models/player]
	 * model with an `id` that matches the `player2Id` specified in the query.
	 **/
	player2: function(){
		return this.belongsTo(Player,"player2Id");
	},
	/**
	 * @function
	 *
	 * Informs Bookshelf.js that the `player3` property will be a [models/player]
	 * model with an `id` that matches the `player3Id` specified in the query.
	 **/
	player3: function(){
		return this.belongsTo(Player,"player3Id");
	},
	/**
	 * @function
	 *
	 * Informs Bookshelf.js that the `player4` property will be a [models/player]
	 * model with an `id` that matches the `player4Id` specified in the query.
	 **/
	player4: function(){
		return this.belongsTo(Player,"player4Id");
	}
});

module.exports = Team;
