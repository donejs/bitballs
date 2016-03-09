var Map = require("can/map/");
var Team = require("bitballs/models/team");
var Game = require("bitballs/models/game");
var Player = require("bitballs/models/player");
var Tournament = require("bitballs/models/tournament");

require("can/map/define/");

module.exports = Map.extend({
	define: {
		tournament: {
			Type: Tournament,
			Value: Tournament
		}
	},
	createTournament: function(ev){
		ev && ev.preventDefault();
		var self = this;

		var promise = this.attr("tournament").save().then(function(player){
			self.attr("tournament", new Tournament());
		});
		
		this.attr("savePromise", promise);

		return promise;
	}
});