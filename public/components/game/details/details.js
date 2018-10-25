/**
 * @module {Module} bitballs/components/game/details <game-details>
 * @parent bitballs.components
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
 * ## Example
 *
 * @demo public/components/game/details/details.html
 *
 */

import { Component, DefineMap, DefineList } from "can";
import Session from "bitballs/models/session";
import Game from "bitballs/models/game";
import Stat from "bitballs/models/stat";
import youtubeAPI from "bitballs/models/youtube";
import platform from "steal-platform";
import $ from "jquery";
import view from "./details.stache";
import "./details.less";
import "bootstrap/dist/css/bootstrap.css";
import "../../../inserted-removed";


/**
 * @constructor bitballs/components/game/details.ViewModel ViewModel
 * @parent bitballs/components/game/details
 *
 * @description  A `<game-details>` component's viewModel.
 */

export const ViewModel = DefineMap.extend('GameDetailsVM',
{
	/**
	 * @property {Object}
	 *
	 * The [YouTube Player object](https://developers.google.com/youtube/js_api_reference).
	 */
	youtubePlayer: 'any',
	/**
	 * @property {Boolean} [autoplay=true] the video when the element is inserted.
	 */
	autoplay: {
		type: 'booolean',
		default: true
	},
	/**
	* @property {bitballs/models/session} bitballs/components/game/details.session session
	* @parent bitballs/components/game/details.properties
	*
	* A [bitballs/models/session] instance used to track a `Session`
	**/
	session: Session,
	/**
	* @property {bitballs/models/stat} bitballs/components/game/details.stat stat
	* @parent bitballs/components/game/details.properties
	*
	* A [bitballs/models/session] instance used to track a `stat`
	**/
	stat: Stat,
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
	 * gameDetailsVM.gamePromise.then(function(game){
	 *   game.date //-> Date
	 * })
	 * ```
	 *
	 */
	get gamePromise() {
		return Game.get({
			id: this.gameId,
			withRelated: ["stats",
				"tournament",
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
	},
	/**
	 * @property {bitballs/models/game}
	 *
	 * Provides a game instance once the game promise resolves.
	 */
	game: {
		get: function(last, set) {
			this.gamePromise.then(set, function(err){
				console.log("GAME LOAD ERROR");
				console.error(err);
			});
		}
	},
	/**
	 * @property {Array<{name: String}>}
	 *
	 * Array of statType objects from [bitballs/models/stat]
	 */
	statTypes: {
		default: () => Stat.statTypes
	},
	/**
	 * @property {Object<{home: Number, away: Number}>}
	 *
	 * The final score of the game, which is totalled based on the
	 * game stats.
	 */
	get finalScore(){
		var game = this.game;
		if(game && game.stats) {
			var playerMap = this.playerIdToHomeOrAwayMap;
			var scores = {home: 0, away: 0};
			game.stats.forEach(function(stat){
				if(stat.type === "1P") {
					scores[playerMap[stat.playerId]]++;
				}
				if(stat.type === "2P") {
					scores[playerMap[ stat.playerId ]] += 2;
				}
			});
			return scores;
		}
	},
	/**
	 * @property {Object<{home: Number, away: Number}>}
	 *
	 * The score of the game at the current time in the video,
	 * which is totalled based on the game stats up to that point.
	 */
	get currentScore() {
		var game = this.game;
		if(game && game.stats) {
			var playerMap = this.playerIdToHomeOrAwayMap;
			var scores = {home: 0, away: 0};
			var time = this.youtubePlayerTime;

			game.stats.forEach(function(stat){
				if(stat.time <= time) {
					if(stat.type === "1P") {
						scores[playerMap[ stat.playerId] ]++;
					}
					if(stat.type === "2P") {
						scores[playerMap[ stat.playerId]] += 2;
					}
				}
			});
			return scores;
		}
	},
	/**
	 * @property {Object}
	 *
	 * An object mapping each player id to "home" or "away" to enable
	 * totalling of scores based on stats.
	 */
	get playerIdToHomeOrAwayMap() {
		var game = this.game;
		if(game && game.homeTeam && game.awayTeam) {
			var map = {};
			for(var i = 1; i <= 4; i++) {
				map[ game.homeTeam["player" + i + "Id"] ] = "home";
				map[ game.awayTeam["player" + i + "Id"] ] = "away";
			}
			return map;
		}
	},
	/**
	 * @property {Object}
	 *
	 * An object of stats sorted by player id from [bitballs/models/stat]
	 */
	get sortedStatsByPlayerId() {
		var game = this.game;
		return game.sortedStatsByPlayerId();
	},

	/**
	 * @function
	 * @description Displays the stat menu for a particular player and time.
	 * @param  {bitballs/models/player} player The player to show the stat menu for.
	 *
	 * @body
	 *
	 * Use this in a template like:
	 *
	 * ```
	 * <tr ($click)="showStatMenuFor(.,scope.element, scope.event)">
	 * ```
	 */
	showStatMenuFor: function(player, element, event){
		if(!this.session || !this.session.isAdmin()) {
			return;
		}
		var youtubePlayer = this.youtubePlayer;
		var time = youtubePlayer.getCurrentTime();
		youtubePlayer.pauseVideo();

		this.stat = new Stat({
			time: time,
			playerId: player.id,
			gameId: this.game.id,
			player: player
		});
	},
	/**
	 * @function
	 * @description Creates a stat from the stat menu.
	 * @param  {Event} ev The event from the stat menu submission.
	 *
	 * @body
	 * Use in a template like:
	 * ```
	 * <span ($click)="gotoTimeMinus5(time, scope.event)">
	 * ```
	 */
	createStat: function(ev) {
		ev.preventDefault();
		var self = this;
		var stat = this.stat;


		stat.save(function(){
			self.stat = null;
		}, function(e){
			self.stat = null;
		});
	},
	/**
	 * @function
	 * @description Remove the currently displayed stat, hiding the stat menu.
	 *
	 * @body
	 * Use in a template like:
	 * ```
	 * <button type="submit" class="btn btn-primary" >Add</button>
	 * <a class="btn btn-default" ($click)="removeStat()">Cancel</a>
	 * ```
	 */
	removeStat: function(){
		this.stat = null;
	},
	/**
	 * @function
	 * @description Adds time to the current stat.
	 * @param {Number} time How much to increment the time by.
	 *
	 * @body
	 * Use in a template like:
	 * ```
	 * <div class="col-xs-6">
	 *   <a class="btn btn-default" ($click)="minusTime(10)">-10 s</a>
	 *   <a class="btn btn-default" ($click)="minusTime(2)">-2 s</a>
	 *   <a class="btn btn-default" ($click)="addTime(2)">+2 s</a>
	 *   <a class="btn btn-default" ($click)="addTime(10)">+10 s</a>
	 * </div>
	 * ```
	 */
	addTime: function(time){
		this.youtubePlayer.seekTo(this.youtubePlayer.getCurrentTime() + time, true);
	},
	/**
	 * @function
	 * @description Subtracts time from the current stat.
	 * @param {Number} time How much to decrement the time by.
	 *
	 * @body
	 * Use in a template like:
	 * ```
	 * <div class="col-xs-6">
	 *   <a class="btn btn-default" ($click)="minusTime(10)">-10 s</a>
	 *   <a class="btn btn-default" ($click)="minusTime(2)">-2 s</a>
	 *   <a class="btn btn-default" ($click)="addTime(2)">+2 s</a>
	 *   <a class="btn btn-default" ($click)="addTime(10)">+10 s</a>
	 * </div>
	 * ```
	 */
	minusTime: function(time){
		this.youtubePlayer.seekTo(this.youtubePlayer.getCurrentTime() - time, true);
	},
	/**
	 * @function
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
		var player = this.youtubePlayer;
		if (player.seekTo) {
			player.seekTo(time - 5, true);
		}
		if (player.playVideo) {
			player.playVideo();
		}
		if(event) {
			event.stopPropagation();
		}
	},
	/**
	 * @function
	 * @description Delete a stat from the database.
	 * @param {bitballs/models/stat} stat The [bitballs/models/stat] to delete.
	 * @param {event} event The event that triggered the deletion.
	 *
	 * @body
	 *
	 * Use in a template like:
	 * ```
	 * <span class="destroy-btn glyphicon glyphicon-trash" ($click)="deleteStat(., scope.event)"></span>
	 * ```
	 */
	deleteStat: function (stat, event) {
		if (! window.confirm('Are you sure you want to delete this stat?')) {
			return;
		}
		stat.destroy();
		if(event) {
			event.stopPropagation();
		}
	},
	/**
	 * @function
	 * @description  Get the percentage of total game time for a certain time for positioning stats.
	 * @param  {Number} time The time of the stat.
	 * @return {Number} The percentage through the total game time the current time is.
	 *
	 * @body
	 *
	 * Use in a template like:
	 * ```
	 * <span style="left: \{{ statPercent time }}%">
	 * ```
	 */
	statPercent: function(time){
		var duration = this.youtubePlayerDuration;
		if(duration) {
			return time / duration * 100;
		} else {
			return "0";
		}
	},

	/**
	 * @function
	 * @description Gets a list of stats for a player
	 * @param  {String|can-compute<String>} id The id of the player.
	 * @return {can-list} The list of stats for the player.
	 *
	 * @body
	 *
	 * Use in a template like:
	 * ```
	 * \{{# each(statsForPlayerId(id)) }}
	 * \{{ type }}
	 * \{{/ each }}
	 * ```
	 */
	statsForPlayerId: function(id){
		var statsById = this.sortedStatsByPlayerId;
		if(statsById) {
			return statsById[id] || new DefineList();
		} else {
			return new DefineList();
		}
	},

	// hold onto the actual element
	element: "any",

	// VIDEO RELATED PROPERTIES
	YT: "any",
	removedFromDOM: "boolean",
	youtubePlayerDuration: {
		value: function(prop) {
			//if(this.removedFromDOM) {
			//	return true;
			//}
			var timer;
			prop.listenTo('youtubePlayerReady',function(){
				var getDuration = () => {
					var duration = this.youtubePlayer.getDuration();
					if(duration) {
						prop.resolve(duration);
					} else {
						timer = setTimeout(getDuration, 100);
					}
				};
				getDuration();
			});
			return function(){
				clearTimeout(timer);
			};
		}
	},
	youtubePlayerIsPlaying: {
		value: function(prop) {
			prop.listenTo('youtubePlayerStateChange',function(event){
				if(event.youtube.data === this.YT.PlayerState.PLAYING) {
					prop.resolve(true);
				} else {
					prop.resolve(false);
				}
			});
		}
	},
	youtubePlayerTime: {
		value: function(prop) {
			// this allows the playerTime to be set directly for testing
			if(prop.lastSet.value) {
				prop.resolve(prop.lastSet.value);
			}
			// use listenTo to update with last set

			// Wait until the playing state changes, and then check the youtube player state
			var timer,
				// when paused, we will still change the position
				checkTime = 300;

			var timeUpdate = () => {
				prop.resolve(this.youtubePlayer.getCurrentTime());
				timer = setTimeout(timeUpdate, checkTime);
			};

			prop.listenTo('youtubePlayerIsPlaying',function(ev, isPlaying){
				clearTimeout(timer);
				checkTime = isPlaying ? 50 : 300;
				timeUpdate();
			});
			return function(){
				clearTimeout(timer);
			};
		}
	},
	cursorPosition: {
		value: function(prop){

			var resolve = () => {
				var time = this.youtubePlayerTime;
				var duration = this.youtubePlayerDuration;
				if(time && duration) {
					var fraction = time / duration;
					var containers = this.element.getElementsByClassName("stats-container");
					var width = $(containers[0]).width();
					var firstOffset = $(containers[0]).offset();
					var height = $(containers[containers.length - 1]).offset().top -
								firstOffset.top + $(containers[containers.length - 1]).outerHeight();
					prop.resolve({
						left: firstOffset.left + fraction*width,
						top: firstOffset.top,
						height: height
					});
				} else {
					prop.resolve({
						left: 0,
						top: 0,
						height: 0
					});
				}
			};
			prop.listenTo("youtubePlayerTime",resolve);
			prop.listenTo("youtubePlayerDuration",resolve);
			prop.listenTo(window,"resize", resolve);
			resolve();
		}
	},
	addStatPosition: {
		value: function(prop){
			var resolve = () => {
				prop.resolve( $(this.element).find(".stats-container:first").offset() );
			};
			prop.listenTo(window,"resize", resolve);
			resolve();
		}
	},
	get players(){
		var game = this.game,
			players = [];
		if(game) {
			game.teams.forEach(function(team){
				team.players.forEach(function(player) {
					players.push(player);
				});
			});
		}
		return players;
	},
	get addStatArrowPosition() {
		var index = 0;
		if(this.stat) {
			for(var i = 0 ; i < this.players.length; i++) {
				if(this.stat.playerId === this.players[i].id) {
					index = i;
				}
			}
		}
		var containers = this.element.getElementsByClassName("stats-container");
		var first = $(containers[0]).offset(),
			height = $(containers[0]).outerHeight();

		return {
			top: $(containers[index]).offset().top - first.top + (height/2)
		};
	},

	connectedCallback(el) {
		this.element = el;
		youtubeAPI().then((YT) => {
			this.YT = YT;
		}).then(() => {
			return this.gamePromise;
		}).then( () => {
			// this component might have been torn down, so check if there's
			// actually a game
			if(this.game) {
				var player = new this.YT.Player('youtube-player', {
					height: '390',
					width: '640',
					videoId: this.game.videoUrl,
					events: {
					  'onReady': () => {
						  this.dispatch("youtubePlayerReady");
					  },
					  'onStateChange': (data) => {
						  this.dispatch({type: "youtubePlayerStateChange", youtube: data});
					  }
					}
				});
				this.youtubePlayer = player;
			}
		})["catch"](function(e){
			if ( platform.isNode ) {
				return;
			}
			setTimeout(function(){
				throw e;
			},1);
		});



		// side effectually start the player
		this.listenTo("youtubePlayerReady", () => {
			var autoplay = this.autoplay;
			if(autoplay && !this.removedFromDOM) {
				this.youtubePlayer.playVideo();
			}
		});

		// When the player time changes, update the state time
		this.listenTo("youtubePlayerTime", (ev, time)=> {
			if(this.stat) {
				this.stat.time = time;
			}
		});

		return () => {
			this.stopListening();
			this.dispatch("disconnected");
			// timeUpdate could be running
			clearTimeout(this.timeUpdate);
			// hack to prevent youtube stuff from running if this element
			// was removed from the page
			this.removedFromDOM = true;
		};
	},


	// Side effectual methods.  These should be called as a result of `connectedCallback()` above

});

export const GameDetails = Component.extend({
	tag: "game-details",
	view,
	ViewModel
});
