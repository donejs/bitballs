var bookshelf = require("./bookshelf"),
	checkit = require('checkit');

var Tournament = bookshelf.Model.extend({
	tableName: 'tournaments',
	initialize: function(){
		this.on('saving', this.validateSave);
	},
	validateSave: function(){
		return checkit({
			date: ['required']
		}).run(this.attributes);
	}
});

module.exports = Tournament;