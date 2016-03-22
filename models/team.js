var bookshelf = require("../models/bookshelf");
var Player = require("./player");
var checkit = require('checkit');

var Team = bookshelf.Model.extend({
	tableName: 'teams',
	initialize: function(){
		this.on('saving', this.validateSave);
	},
	validateSave: function(){
		return checkit({
			player1Id: {rule: 'required', message: 'Player 1 is required'},
			player2Id: {rule: 'required', message: 'Player 2 is required'},
			player3Id: {rule: 'required', message: 'Player 3 is required'},
			player4Id: {rule: 'required', message: 'Player 4 is required'}
		}).run(this.attributes);
	},
	player1: function(){
		return this.belongsTo(Player,"player1Id");
	},
	player2: function(){
		return this.belongsTo(Player,"player2Id");
	},
	player3: function(){
		return this.belongsTo(Player,"player3Id");
	},
	player4: function(){
		return this.belongsTo(Player,"player4Id");
	}
});

//var Teams = bookshelf.Collection.extend({
//  model: Team
//});

module.exports = Team;
