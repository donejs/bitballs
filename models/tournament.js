var bookshelf = require("./bookshelf"),
	checkit = require('checkit');

/**
 * @module {bookshelf.Model} models/tournament Tournament
 * @parent bitballs.serviceModels
 *
 * @group models/tournament.properties 0 properties
 *
 * @signature `new Tournament(properties)`
 *   Creates an instance of a model.
 *
 *   @param {Object} properties Initial values for this model's properties.
 */

var Tournament = bookshelf.Model.extend(
/** @prototype **/
{
	/**
	 * @property {String<"tournaments">} models/tournament.properties.tableName tableName
	 * @parent models/tournament.properties
	 *
	 * Indicates which database table Bookshelf.js will query against.
	 **/
	tableName: 'tournaments',
	/**
	 * @function
	 *
	 * Binds to the "saving" event and specifies [models/tournament.prototype.validateSave validateSave]
	 * as the handler during initialization.
	 **/
	initialize: function(){
		this.on('saving', this.validateSave);
	},
	/**
	 * @function
	 *
	 * Validates that `date` is defined on `this.attributes`.
	 *
	 * @return {Promise}
	 **/
	validateSave: function(){
		return checkit({
			date: ['required']
		}).run(this.attributes);
	}
});

module.exports = Tournament;