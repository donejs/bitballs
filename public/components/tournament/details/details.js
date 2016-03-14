var Component = require("can/component/component");
var Map = require("can/map/");
var Team = require("bitballs/models/team");
var Game = require("bitballs/models/game");
var Player = require("bitballs/models/player");
var Tournament = require("bitballs/models/tournament");

require("can/map/define/");
require("bootstrap/dist/css/bootstrap.css!");
require("can/route/");
require("can/view/href/");

exports.ViewModel = Map.extend({
	define: {
		tournament: {
			get: function(lastSet, setVal){
				Tournament.get({id: this.attr("tournamentId")}).then(setVal);
			}
		},
		gamesPromise: {
			get: function(){
				return Game.getList({
					where: {tournamentId: this.attr("tournamentId")}
				});
			}
		},
		games: {
			get: function(lastSet, setVal){
				this.attr("gamesPromise").then(setVal);
			}
		},
		gamesGroupedByRound: {
			get: function(){
				// return;
				console.log("grouping re-evaluate");
				var rounds = {},
					games = this.attr("games");
				if(games) {
					games.each(function(game){
						var round = game.attr("round");
						if(!rounds[round]) {
							rounds[round] = [];
						}
						rounds[round].push(game);
					});
				}
				return rounds;
			}
		},
		teamsPromise: {
			get: function(){
				return Team.getList({
					where: {tournamentId: this.attr("tournamentId")}
				});
			}
		},
		teams: {
			get: function(lastSet, setVal){
				this.attr("teamsPromise").then(setVal);
			}
		},
		teamColors: {
			value: Team.colors,
			type: "*"
		},
		availableColors: {
			get: function(){
				// return;
				var teams = this.attr("teams");
				if(!teams) {
					return this.attr("teamColors");
				} else {
					var allColors = this.attr("teamColors").slice(0);
					teams.each(function(team){
						var index = allColors.indexOf(team.attr("color"));
						if(index != -1) {
							allColors.splice(index, 1);
						}
					});
					return allColors;
				}
			},
			value: "*"
		},
		game: {
			Value: Game
		},
		team: {
			Value: Team
		},
		playersPromise: {
			value: function(){
				return Player.getList({orderBy: "name"})
			}
		},
		players: {
			get: function(set, resolve){
				this.attr("playersPromise").then(resolve);
			}
		},
		playerIdMap: {
			get: function(){
				var map = {},
					players = this.attr("players");

				if(players) {
					players.each(function(player){
						map[player.attr("id")] = player;
					});
				}

				return map;
			},
			type: "*"
		},
		teamIdMap: {
			get: function(){
				var map = {};
				var teams = this.attr("teams");
				if(teams) {
					teams.each(function(team){
						map[team.attr("id")] = team;
					});
				}

				return map;
			},
			type: "*"
		}
	},
	availableTeamFor: function(name, round){
		// return;
		var teams = this.attr("teams");
		var games = this.attr("games");
		if(!games || !teams) {
			return [];
		}

		if(!round) {
			return teams;
		}
		// hack b/c canjs sucks
		teams.attr("length");
		var remainingTeams = teams.slice(0);
		games.forEach(function(game){
			if(game.attr("round") === round) {
				remainingTeams.removeById(game.attr("homeTeamId"));
				remainingTeams.removeById(game.attr("awayTeamId"));
			}
		});

		var opposite = name === "home" ? "away" : "home",
			oppositeId = this.attr("game").attr(opposite+"TeamId");

		if(oppositeId) {
			remainingTeams.removeById(oppositeId);
		}
		return remainingTeams;
	},
	availablePlayersFor: function(team, number){
		// return;
		var allPlayers = this.attr("players"),
			teams = this.attr('teams');
		if(allPlayers && teams) {
			var usedIds = {};

			teams.each(function(tm){
				if(tm !== team) {
					[1,2,3,4].forEach(function(index){
						usedIds[tm.attr("player"+index+"Id")] = true;
					});
				}
			});


			[1,2,3,4].forEach(function(index){
				if(index != number) {
					usedIds[team.attr("player"+index+"Id")] = true;
				}
			});
			return allPlayers.filter(function(player){
				return !usedIds[player.attr("id")];
			});
		} else {
			return [];
		}



	},
	createTeam: function(ev){
		ev.preventDefault();
		var self = this;
		if(!this.attr("team.color")){
			this.attr("team").attr("color", this.attr("availableColors")[0]);
		}

		this.attr("team").attr("tournamentId", this.attr("tournamentId"))
			.save(function(){
			self.attr("team", new Team());
		});
	},
	roundNames: Game.roundNames,
	createGame: function(ev) {
		ev.preventDefault();
		var self = this;
		var game = this.attr("game");

		// cleanup that https://github.com/bitovi/canjs/issues/1834 should do for us
		if(!game.attr("court")) {
			game.attr("court","1");
		}

		if(!game.attr("round")) {
			game.attr("round",Game.roundNames[0]);
		}

		game.attr("tournamentId", this.attr("tournamentId"))
			.save(function(){
			self.attr("game", new Game());
		});
	}
});

exports.Component = Component.extend({
	tag: "tournament-details",
	template: require("./details.stache!"),
	viewModel: exports.ViewModel,
	events: {
		inserted: function () {
			console.log('inserted')
		}
	},
	helpers: {
		playerById: function(id, options){
			var idVal = id();
			if(idVal != null) {
				return options.fn( this.attr("playerIdMap")[idVal] );
			} else {
				return;
			}

		},
		teamById: function(id, options){
			var idVal = id();
			if(idVal != null) {
				return options.fn( this.attr("teamIdMap")[idVal] );
			} else {
				return;
			}

		}
	}
});
