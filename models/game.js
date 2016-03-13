var bookshelf = require("../models/bookshelf");
var Stat = require("./stat");
var Team = require("./team");

var Game = bookshelf.Model.extend({
	tableName: 'games',
	stats: function(){
		return this.hasMany(Stat,"gameId");
	},
	homeTeam: function(){
		return this.belongsTo(Team,"homeTeamId");
	},
	awayTeam: function(){
		return this.belongsTo(Team,"awayTeamId");
	}
});


module.exports = Game;
