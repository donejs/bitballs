var Component = require("can/component/component");
var Map = require("can/map/");

require("./details.less!");
require("bootstrap/dist/css/bootstrap.css!");
require("can/map/define/");
require("can/route/");
require("can/view/href/");

var Tournament = require("bitballs/models/tournament");
var Game = require("bitballs/models/game");
var Team = require("bitballs/models/team");
var Player = require("bitballs/models/player");
var Stat = require("bitballs/models/stat");
var youtubeAPI = require("bitballs/models/youtube");

exports.ViewModel = Map.extend({
	define: {
		gamePromise: {
			get: function() {
				return Game.get({
					id: this.attr("gameId"),
					withRelated: ["stats",
						"homeTeam.player1",
						"homeTeam.player2",
						"homeTeam.player3",
						"homeTeam.player4",
						"awayTeam.player1",
						"awayTeam.player2",
						"awayTeam.player3",
						"awayTeam.player4"
					]
				});
			}
		},
		game: {
			get: function(last, set){
				this.attr('gamePromise').then(set);
			}
		},
		youtubePlayer: {
			type: "*"
		},
		statTypes: {
			value: Stat.statTypes
		},
		finalScore: {
			get: function(){
				var game = this.attr("game");
				if(game) {
					var playerMap = this.attr("playerIdToHomeOrAwayMap");
					var scores = {home: 0, away: 0};
					game.attr("stats").each(function(stat){
						if(stat.attr("type") === "1P") {
							scores[playerMap[ stat.attr("playerId")]]++;
						}
						if(stat.attr("type") === "2P") {
							scores[playerMap[ stat.attr("playerId")]] += 2;
						}
					});
					return scores;
				}
			},
			type:"*"
		},
		currentScore: {
			get: function(){
				var game = this.attr("game");
				if(game) {
					var playerMap = this.attr("playerIdToHomeOrAwayMap");
					var scores = {home: 0, away: 0};

					var time = this.attr("time");

					game.attr("stats").each(function(stat){
						if(stat.attr("time") <= time) {
							if(stat.attr("type") === "1P") {
								scores[playerMap[ stat.attr("playerId")] ]++;
							}
							if(stat.attr("type") === "2P") {
								scores[playerMap[ stat.attr("playerId")]] += 2;
							}
						}
					});
					return scores;
				}
			},
			type:"*"
		},
		playerIdToHomeOrAwayMap: {
			type: "*",
			get: function(){
				var game = this.attr("game");
				if(game) {
					var map = {};
					for(var i = 1; i <= 4; i++) {
						map[ game.attr("homeTeam").attr("player"+i+"Id") ] = "home";
						map[ game.attr("awayTeam").attr("player"+i+"Id") ] = "away";
					}
					return map;
				}
			}
		}
	},
	showStatMenuFor: function(player, element, event){
		if(!this.attr("session").attr('user').isAdmin()) {
			return;
		}
		var youtubePlayer = this.attr("youtubePlayer");
		var time = youtubePlayer.getCurrentTime();
		youtubePlayer.pauseVideo();


		this.attr("stat", new Stat({
			time: time,
			playerId: player.attr("id"),
			gameId: this.attr("game.id"),
			player: player
		}));
	},
	createStat: function(ev) {
		ev.preventDefault();
		var self = this;
		var stat = this.attr("stat");


		stat.save(function(){
			self.removeAttr("stat");
		}, function(e){
			console.log(e);
			self.removeAttr("stat");
		});
	},
	removeStat: function(){
		this.removeAttr("stat");
	},
	addTime: function(time){
		this.attr("stat.time", this.attr("stat.time")+time);
	},
	minusTime: function(time){
		this.attr("stat.time", this.attr("stat.time")-time);
	},
	gotoTimeMinus5: function(time, event) {
		this.attr("youtubePlayer").seekTo(time - 5, true);
		this.attr("youtubePlayer").playVideo();
		event.stopPropagation();
	}
});

exports.Component = Component.extend({
	tag: "game-details",
	template: require("./details.stache!"),
	viewModel: exports.ViewModel,
	events: {
		inserted: function(){
			var self = this;
			youtubeAPI().then(function(YT){
				self.YT = YT;
				//console.log('gA2Y1UQ5zjE',self.scope.attr("videoUrl"));
				var player = new YT.Player('youtube-player', {
					height: '390',
					width: '640',
					videoId: self.scope.attr("game.videoUrl"),
					events: {
					  'onReady': self.onPlayerReady.bind(self),
					  'onStateChange': self.onPlayerStateChange.bind(self)
					}
				});
				self.scope.attr("youtubePlayer", player);
				
			})["catch"](function(e){
				setTimeout(function(){
					throw e
				},1);
			});
		},
		onPlayerReady: function(){
			var youtubePlayer = this.scope.attr("youtubePlayer"),
				self = this;
			
			//this.scope.attr("youtubePlayer").playVideo();
			
			// get durration
			var getDuration = function(){
				var duration = youtubePlayer.getDuration();
				if(duration) {
					self.scope.attr("duration", duration);
				} else {
					setTimeout(getDuration, 100);
				}
			};
			getDuration();
		},
		onPlayerStateChange: function(ev){
			var viewModel = this.viewModel,
				player = viewModel.attr("youtubePlayer"),
				self = this;
			var timeUpdate = function(){
				var currentTime = player.getCurrentTime();
				if(viewModel.attr("stat")) {
					viewModel.attr("stat").attr("time", currentTime);
				}
				self.timeUpdate = setTimeout(timeUpdate, 100);
				self.updatePosition(currentTime);
			};
			
			
			if(ev.data === YT.PlayerState.PLAYING) {
				this.scope.attr("playing", true);
				timeUpdate();
			} else {
				this.scope.attr("playing", false);
				clearTimeout(this.timeUpdate);
			}
			

		},
		updatePosition: function(time){
			var duration = this.scope.attr("duration");
			if(duration) {
				this.viewModel.attr("time", time);
				var fraction = time /duration;
				var containers = this.element.find(".stats-container");
				var width = containers.width();
				var firstOffset = containers.first().offset();
				var height = containers.last().offset().top - firstOffset.top + containers.last().height();
				$("#player-pos").offset({
					left: firstOffset.left + fraction*width,
					top: firstOffset.top
				}).height(height);
			}
		},
		"{stat} time": function(){
			var time = this.scope.attr("stat.time");
			if(typeof time === "number" && time >= 0) {
				
				var player = this.scope.attr("youtubePlayer");
				var playerTime = player.getCurrentTime();
				if(Math.abs(time-playerTime) > 2) {
					player.seekTo(time, true);
				}
				
			}
			
		},
		"{window} resize": function(){
			var player = this.viewModel.attr("youtubePlayer");
			var currentTime = player.getCurrentTime();
			this.updatePosition(currentTime);
		},
		"{viewModel} stat": function(vm, ev, newVal){
			setTimeout(function(){
				
				
				$("#add-stat").offset( $(".stats-container:first").offset() ).show()
			},1);

		}
	},
	helpers: {
		statsForPlayerId: function(id, options){
			return this.attr("game").statsForPlayerId(id).map(function(stat){
				return options.fn(stat);
			});
		},
		statPercent: function(time){
			var duration = this.attr("duration");
			if(duration) {
				return time() / duration * 100;
			} else {
				return "0"
			}
			
		}
	}
});
