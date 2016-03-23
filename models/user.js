var bookshelf = require("./bookshelf");
var checkit = require('checkit');

/**
 * @module {bookshelf.Model} models/user User
 * @parent bitballs.serviceModels
 *
 * @group models/user.properties 0 properties
 *
 * @signature `new User(properties)`
 *   Creates an instance of a model.
 *
 *   @param {Object} properties Initial values for this model's properties.
 */

var User = bookshelf.Model.extend(
/** @prototype **/
{
	/**
	 * @property {String<"users">} models/user.properties.tableName tableName
	 * @parent models/user.properties
	 *
	 * Indicates which database table Bookshelf.js will query against.
	 **/
	tableName: 'users',
	/**
	 * @function
	 *
	 * Binds to the "saving" event and specifies [models/user.prototype.validateSave validateSave]
	 * as the handler during initialization.
	 **/
	initialize: function(){
		this.on('saving', this.validateSave);
	},
	/**
	 * @function
	 *
	 * Validates that `email` is defined and formatted as an email address
	 * and `password` is defiend on `this.attributes`.
	 *
	 * @return {Promise}
	 **/
	validateSave: function(){
		return checkit({
			email: ['required', 'email'],
			password: 'required'
		}).run(this.attributes);
	}
});

module.exports = User;
