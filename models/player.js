var bookshelf = require("../bookshelf"),
	checkit = require("checkit");

var Player = bookshelf.Model.extend({
	tableName: 'players',
	initialize: function(){
		this.on('saving', this.validateSave);
	},
	validateSave: function(){
		return checkit({
			name: 'required'
		}).run(this.attributes);
	}
});

module.exports = Player;