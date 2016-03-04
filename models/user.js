var bookshelf = require("../bookshelf");
var checkit = require('checkit');

var User = bookshelf.Model.extend({
	tableName: 'users',
	initialize: function(){
		this.on('saving', this.validateSave);
	},
	validateSave: function(){
		return checkit({
			email: ['required', 'email'],
			password: 'required'
		}).run(this.attributes);
	}
});

module.exports = User;