var Map = require('can/map/');
var superMap = require('can-connect/can/super-map/');
var tag = require('can-connect/can/tag/');
var Player = require("./player");

var Team = Map.extend({
	colors: ["Black","White","Red","Green","Blue","Yellow","Brown","Gray","Orange","Purple"]
},{
	define: {
		tournamentId: {
			type: "number"
		},
		player1: {
			Type: Player
		},
		player2: {
			Type: Player
		},
		player3: {
			Type: Player
		},
		player4: {
			Type: Player
		},
		players: {
			get: function(){
				
				var players = [],
					self = this;
					
				 ["player1","player2","player3","player4"].map(function(name){
					if(self.attr(name)) {
						players.push(self.attr(name));
					}
				});
				
				return new Player.List(players);
			}
		}
	}
});
Team.List = can.List.extend({Map: Team},{
	removeById: function(id){
		var i  = 0; 
		while(i < this.length) {
			if(this[i].attr("id") === id) {
				this.splice(i, 1);
			} else {
				i++;
			}
		}
	}
});

var teamConnection = superMap({
  Map: Team,
  List: Team.List,
  url: "/services/teams",
  name: "team"
});

tag("team-model", teamConnection);

module.exports = Team;