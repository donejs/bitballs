var bookshelf = require("./bookshelf");
var checkit = require("checkit");

/**
 * @module {bookshelf.Model} models/player Player
 * @parent bitballs.serviceModels
 *
 * @group models/player.properties 0 properties
 *
 * @signature `new Player(properties)`
 *   Creates an instance of a model.
 *
 *   @param {Object} properties Initial values for this model's properties.
 */

var Player = bookshelf.Model.extend(
/** @prototype **/
{
	/**
	 * @property {String<"players">} models/player.properties.tableName tableName
	 * @parent models/player.properties
	 *
	 * Indicates which database table Bookshelf.js will query against.
	 **/
	tableName: 'players',
	/**
	 * @function
	 *
	 * Binds to the "saving" event and specifies [models/player.prototype.validateSave validateSave]
	 * as the handler during initialization.
	 **/
	initialize: function(){
		 this.on('saving', this.validateSave);
	 },
	/**
	 * @function
	 *
	 * Validates that `name` is defined on `this.attributes`.
	 *
	 * @return {Promise}
	 **/
	validateSave: function(){
		return checkit({
			name: 'required'
		}).run(this.attributes);
	},
	/**
	 * @function
	 *
	 * Informs Bookshelf.js that the `stats` property will be a list of
	 * [models/stat] models with a `playerId` that
	 * matches the `id` specified in the query.
	 **/
	stats: function(){
		var Stat = require("./stat");
		return this.hasMany(Stat,"playerId");
	}
});

module.exports = Player;
