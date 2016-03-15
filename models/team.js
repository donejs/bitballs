var bookshelf = require("../models/bookshelf");
var Player = require("./player");

var Team = bookshelf.Model.extend({
	tableName: 'teams',
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
