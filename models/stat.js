var bookshelf = require("../models/bookshelf");

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

var Stat = bookshelf.Model.extend({
	/**
	 * @property {String<"stats">} models/stat.properties.tableName tableName
	 * @parent models/stat.properties
	 *
	 * Indicates which database table Bookshelf.js will query against.
	 **/
	tableName: 'stats'
});

module.exports = Stat;
