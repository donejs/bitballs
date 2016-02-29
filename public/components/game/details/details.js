/**
 * @module {Module} bitballs/components/game/details <game-details>
 * @parent bitballs.client
 *
 * @description Provides a custom element that allows a user
 * to either view a game or edit a game's stats.
 * 
 * @body
 *
 * To create a `<game-details>` element pass the [bitballs/models/session]
 * and a [bitballs/models/game] id like:
 *
 * ```
 * <game-details 
 *     {session}="session"
 *     {game-id}="gameId"
 *     ></games-details>
 * ```
 *
 * ## Sweet example
 * 
 * @demo bitballs/public/components/game/details/details.html
 * 
 */

var Component = require("can/component/component");
var Map = require("can/map/");

require("./details.less!");
require("bootstrap/dist/css/bootstrap.css!");
require("can/map/define/");
require("can/route/");
require("can/view/href/");

var platform = require( "steal-platform" );
var Tournament = require("bitballs/models/tournament/");
var Game = require("bitballs/models/game/");
var Team = require("bitballs/models/team");
var Player = require("bitballs/models/player");
var Stat = require("bitballs/models/stat");
var youtubeAPI = require("bitballs/models/youtube");

/**
 * @constructor bitballs/components/game/details.ViewModel ViewModel
 * @parent bitballs/components/game/details
 *
 * @description  A `<game-details>` component's viewModel.
 */

exports.ViewModel = Map.extend(
/**
 * @prototype
 */
{
	define: {
		/**
		 * @property {Promise<bitballs/models/game>|undefined} 
		 *
		 * Provides a Game instance with all the stats for the
		 * game and all the player information!
		 *
		 * @signature `Promise<bitballs/models/game>`
		 *
		 *   Given a valid `gameId`, the game promise.
		 *
		 * @signature `undefined`
		 *
		 *   Given an invalid `gameId`, the game promise.
		 *
		 * 
		 * @body
		 * 
		 * ```
		 * var gameDetailsVM = new GameDetailsViewModel({
		 *   gameId: 5
		 * });
		 * gameDetailsVM.attr("gamePromise").then(function(game){
		 *   game.attr("date") //-> Date
		 * })
		 * ```
		 * 
		 */
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
				if(game && game.attr("stats")) {
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
				if(game && game.attr("stats")) {
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
				if(game && game.attr("homeTeam") && game.attr("awayTeam")) {
					var map = {};
					for(var i = 1; i <= 4; i++) {
						map[ game.attr("homeTeam").attr("player"+i+"Id") ] = "home";
						map[ game.attr("awayTeam").attr("player"+i+"Id") ] = "away";
					}
					return map;
				}
			}
		},
		sortedStatsByPlayerId: {
			type: "*",
			get: function(){
				var game = this.attr("game");
				if(game) {
					return game.sortedStatsByPlayerId();
				}
			}
		}
	},
	showStatMenuFor: function(player, element, event){
		if(!this.attr("session") || !this.attr("session").isAdmin()) {
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
	/**
	 * Moves the youtube player to minus 5 seconds for a given time.
	 * 
	 * @param  {Number} time  
	 *    The time of some event.
	 *    
	 * @param  {Event} [event] 
	 *    An optional event that's default will be prevented.
	 *
	 * @body
	 *
	 * Use this in a template like:
	 *
	 * ```
	 * <button ($click)="gotoTimeMinus5(stat.time,$event)">
	 * ```
	 */
	gotoTimeMinus5: function(time, event) {
		this.attr("youtubePlayer").seekTo(time - 5, true);
		this.attr("youtubePlayer").playVideo();
		event && event.stopPropagation();
	},
	
	statPercent: function(time){
		var duration = this.attr("duration");
		if(duration) {
			return time() / duration * 100;
		} else {
			return "0"
		}
		
	},
	statsForPlayerId: function(id){
		if(typeof id === "function") {
			id = id();
		}
		var statsById = this.attr("sortedStatsByPlayerId");
		if(statsById) {
			return statsById[id] || new can.List();
		} else {
			return new can.List();
		}
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
				if ( platform.isNode ) {
					return;
				}
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
		
	}
});
