/**
 * @module {Module} bitballs/components/tournament/details <tournament-details>
 * @parent bitballs.components
 * @group bitballs/components/tournament/details.properties 0 properties
 *
 * @description Provides an overview of the games, teams, rounds, and courts
 * that make up a tournament.
 *
 * @signature `<tournament-details {is-admin} {tournament-id} />`
 *   Creates a game table organized by rounds/courts and a player table
 *   organized by teams.
 *
 *   @param {Boolean} is-admin Configures whether or not admin specific
 *   features are enabled.
 *
 *   @param {Number} tournament-id The id of the [bitballs/models/tournament]
 *   model that will be used.
 *
 * @body
 *
 * To create a `<tournament-details>` element pass the [bitballs/models/tournament] `id` like:
 *
 * ```
 * <tournament-details
 *     {tournament-id}="app.tournamentId" />
 * ```
 *
 * ## Example
 *
 * @demo public/components/tournament/details/details.html
 *
 */
var Component = require("can/component/component");
var CanMap = require("can/map/");
var Team = require("bitballs/models/team");
var Game = require("bitballs/models/game");
var Player = require("bitballs/models/player");
var Tournament = require("bitballs/models/tournament");

require("can/map/define/");
require("bootstrap/dist/css/bootstrap.css!");
require("can/route/");
require("can/view/href/");

exports.ViewModel = CanMap.extend(
/** @prototype */
{
	/**
	 * Called internally during view model initialization. Binds
	 * [bitballs/components/tournament/details.ViewModel.prototype.userSelectedCourt userSelectedCourt]
	 * to [bitballs/components/tournament/details.ViewModel.prototype.userSelectedRound userSelectedRound]
	 * and sets the value to `null` when a change occurs. Similarly for
	 * [bitballs/components/tournament/details.ViewModel.prototype.userSelectedRound userSelectedRound]
	 * and [bitballs/components/tournament/details.ViewModel.prototype.gamesLength gamesLength].
	 */
	init: function () {
		this.bind('userSelectedRound', function () {
			this.attr('userSelectedCourt', null);
		});
		this.bind('gamesLength', function () {
			this.attr('userSelectedRound', null);
		});
	},
	define: {
		/**
		* @property {Promise<bitballs/models/tournament>} bitballs/components/tournament/details.tournamentPromise tournamentPromise
		* @parent bitballs/components/tournament/details.properties
		*
		* Configures whether or not admin specific features are enabled.
		**/
		tournamentPromise: {
			get: function(){
				return Tournament.get({id: this.attr("tournamentId")});
			}
		},
		/**
		* @property {Boolean} bitballs/components/tournament/details.isAdmin isAdmin
		* @parent bitballs/components/tournament/details.properties
		*
		* Configures whether or not admin specific features are enabled.
		**/
		isAdmin: {
			type: 'boolean',
			value: false
		},
		/**
		* @property {Number} bitballs/components/tournament/details.tournamentId tournamentId
		* @parent bitballs/components/tournament/details.properties
		*
		* The `id` used to fetch the [bitballs/models/tournament] model.
		**/
		/**
		* @property {bitballs/models/tournament} bitballs/components/tournament/details.tournament tournament
		* @parent bitballs/components/tournament/details.properties
		*
		* The [bitballs/models/tournament] model that the component is bound to.
		**/
		tournament: {
			get: function(lastSet, setVal){
				this.attr('tournamentPromise').then(setVal);
			}
		},
		/**
		* @property {Promise<bitballs/models/game.static.List>} bitballs/components/tournament/details.gamesPromise gamesPromise
		* @parent bitballs/components/tournament/details.properties
		*
		* A promise that fetches a [bitballs/models/game.static.List Game List] based on
		* [bitballs/components/tournament/details.ViewModel.prototype.tournamentId tournamentId].
		**/
		gamesPromise: {
			get: function(){
				return Game.getList({
					where: {tournamentId: this.attr("tournamentId")}
				});
			}
		},
		/**
		* @property {bitballs/models/game.static.List} bitballs/components/tournament/details.games games
		* @parent bitballs/components/tournament/details.properties
		*
		* A [bitballs/models/game.static.List Game List] instance.
		**/
		games: {
			get: function(lastSet, setVal){
				this.attr("gamesPromise").then(setVal);
			}
		},
		/**
		* @property {Number} bitballs/components/tournament/details.gamesLength gamesLength
		* @parent bitballs/components/tournament/details.properties
		*
		* The `length` of the [bitballs/components/tournament/details.ViewModel.prototype.games games]
		* list.
		**/
		gamesLength: {
			get: function () {
				return this.attr('games.length');
			}
		},
		/**
		* @property {Promise<bitballs/models/team.static.List>} bitballs/components/tournament/details.teamsPromise teamsPromise
		* @parent bitballs/components/tournament/details.properties
		*
		* A promise that resolves to a [bitballs/models/team.static.List Team List] based on
		* [bitballs/components/tournament/details.ViewModel.prototype.tournamentId tournamentId].
		**/
		teamsPromise: {
			get: function(){
				return Team.getList({
					where: {tournamentId: this.attr("tournamentId")}
				});
			}
		},
		/**
		* @property {bitballs/models/team.static.List} bitballs/components/tournament/details.teams teams
		* @parent bitballs/components/tournament/details.properties
		*
		* A [bitballs/models/team.static.List Team List] instance.
		**/
		teams: {
			get: function(lastSet, setVal){
				this.attr("teamsPromise").then(setVal);
			}
		},
		/**
		* @property {Array} bitballs/components/tournament/details.availableColors availableColors
		* @parent bitballs/components/tournament/details.properties
		*
		* A filtered list of colors from the [bitballs/models/team.static.colors Colors]
		* list that aren't already associated with a [bitballs/models/team]
		* model in the [bitballs/components/tournament/details.ViewModel.prototype.teams Teams] list.
		**/
		availableColors: {
			type: '*',
			get: function(){
				var teams = this.attr("teams");
				if(!teams) {
					return Team.colors;
				} else {
					var allColors = Team.colors.slice(0);
					teams.each(function(team){
						var index = allColors.indexOf(team.attr("color"));
						if(index !== -1) {
							allColors.splice(index, 1);
						}
					});
					return allColors;
				}
			}
		},
		/**
		* @property {bitballs/models/game} bitballs/components/tournament/details.game game
		* @parent bitballs/components/tournament/details.properties
		*
		* A [bitballs/models/game] instance used to create a `Game`.
		**/
		game: {
			Value: Game
		},
		/**
		* @property {bitballs/models/team} bitballs/components/tournament/details.team team
		* @parent bitballs/components/tournament/details.properties
		*
		* A [bitballs/models/team] instance used to create a `Team`.
		**/
		team: {
			Value: Team
		},
		/**
		* @property {Promise<bitballs/models/player.static.List>} bitballs/components/tournament/details.playersPromise playersPromise
		* @parent bitballs/components/tournament/details.properties
		*
		* A promise that resolves to a [bitballs/models/player.static.List Team List].
		**/
		playersPromise: {
			value: function(){
				return Player.getList({orderBy: "name"});
			}
		},
		/**
		* @property {Player.List} bitballs/components/tournament/details.players players
		* @parent bitballs/components/tournament/details.properties
		*
		* A [bitballs/models/player.static.List Player List] instance.
		**/
		players: {
			get: function(set, resolve){
				this.attr("playersPromise").then(resolve);
			}
		},
		/**
		* @property {String|null} bitballs/components/tournament/details.userSelectedRound userSelectedRound
		* @parent bitballs/components/tournament/details.properties
		*
		* The round selection made by the user.
		**/
		userSelectedRound: {
			value: null
		},
		/**
		* @property {String} bitballs/components/tournament/details.selectedRound selectedRound
		* @parent bitballs/components/tournament/details.properties
		*
		* The [bitballs/components/tournament/details.ViewModel.prototype.userSelectedRound userSelectedRound]
		* or the first value in the list returned from [bitballs/models/game.static.List.prototype.getAvailableRounds getAvailableRounds].
		**/
		selectedRound: {
			set: function (setVal) {
				this.attr('userSelectedRound', setVal);
				return setVal;
			},
			get: function () {
				return this.attr('userSelectedRound') ||
					this.attr('games') && this.attr('games').getAvailableRounds()[0];
			}
		},
		/**
		* @property {String|null} bitballs/components/tournament/details.userSelectedCourt userSelectedCourt
		* @parent bitballs/components/tournament/details.properties
		*
		* The court selection made by the user.
		**/
		userSelectedCourt: {
			value: null
		},
		/**
		* @property {String} bitballs/components/tournament/details.selectedCourt selectedCourt
		* @parent bitballs/components/tournament/details.properties
		*
		* The [bitballs/components/tournament/details.ViewModel.prototype.userSelectedCourt userSelectedCourt]
		* or the first value in the list returned from [bitballs/models/game.static.List.prototype.getAvailableCourts getAvailableCourts]
		* given the [bitballs/components/tournament/details.ViewModel.prototype.selectedRound selectedRound].
		**/
		selectedCourt: {
			set: function (setVal) {
				this.attr('userSelectedCourt', setVal);
				return setVal;
			},
			get: function () {
				return this.attr('userSelectedCourt') ||
					this.attr('games') && this.attr('games').getAvailableCourts(this.attr('selectedRound'))[0];
			}
		},
		/**
		* @property {Object} bitballs/components/tournament/details.teamIdMap teamIdMap
		* @parent bitballs/components/tournament/details.properties
		*
		* A map of [bitballs/models/team.prototype.id team id]'s to [bitballs/models/team] models.
		**/
		teamIdMap: {
			type: "*",
			get: function(){
				var map = {};
				var teams = this.attr("teams");
				if(teams) {
					teams.each(function(team){
						map[team.attr("id")] = team;
					});
				}

				return map;
			}
		}
	},
	/**
	 * @function availableTeamFor
	 *
	 * Filters the [bitballs/components/tournament/details.ViewModel.prototype.teams teams] list
	 * to exclude teams that are already assigned to a [bitballs/models/game].
	 *
	 * @param {String} name "home" or "away".
	 * @param {String} round  A round name from [bitballs/models/game.static.roundNames roundNames].
	 *
	 * @return {bitballs/models/team.static.List|Array} An array of [bitballs/models/team] models.
	 **/
	// TODO: Make into a Team.List helper
	availableTeamFor: function(name, round){
		var teams = this.attr("teams");
		var games = this.attr("games");
		if(!games || !teams) {
			return [];
		}

		if(!round) {
			return teams;
		}
		// Re-evaluate if teams are added/removed
		teams.attr("length");
		var remainingTeams = teams.slice(0);

		games.forEach(function(game){
			// TODO: Get a reference to the games in this round more quickly
			// using `gamesGroupedByRound` instead of iterating
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
	/**
	 * Filters the [bitballs/components/tournament/details.ViewModel.prototype.players players] list
	 * to exclude players that are already assigned to a [bitballs/models/team].
	 *
	 * @param {String} team A reference to a [bitballs/models/team] model instance.
	 * @param {Number} number The player number on the team.
	 *
	 * @return {bitballs/models/player.static.List|Array} An array of [bitballs/models/team] models.
	 **/
	availablePlayersFor: function(team, number){

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
				if(index !== number) {
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
	/**
	 * Sets properties on the [bitballs/components/tournament/details.ViewModel.prototype.team team]
	 * model then persists it to the server. Once the "save" request resolves a new [bitballs/models/team] instance
	 * is created and assigned to [bitballs/components/tournament/details.ViewModel.prototype.team team].
	 *
	 * @param {Event} [ev] A DOM Level 2 event that [`preventDefault`](https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault)
	 * will be called on.
	 **/
	createTeam: function(ev){
		if (ev) {
			ev.preventDefault();
		}
		var self = this;
		if(!this.attr("team.color")){
			this.attr("team").attr("color", this.attr("availableColors")[0]);
		}

		this.attr("team").attr("tournamentId", this.attr("tournamentId"))
			.save(function(){
			self.attr("team", new Team());
		});
	},
	Game: Game,
	/**
	 * Sets properties on the [bitballs/components/tournament/details.ViewModel.prototype.game game]
	 * model then persists it to the server. Once the "save" request resolves a new [bitballs/models/game] instance
	 * is created and assigned to [bitballs/components/tournament/details.ViewModel.prototype.game game].
	 *
	 * @param {Event} [ev] A DOM Level 2 event that [`preventDefault`](https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault)
	 * will be called on.
	 **/
	createGame: function(ev) {

		ev.preventDefault();

		var self = this;
		var game = this.attr("game");

		game.attr({
			round: this.attr('selectedRound'),
			court: this.attr('selectedCourt'),
			tournamentId: this.attr('tournamentId')
		}).save(function(){
			self.attr("game", new Game());
		});
	}
});

exports.Component = Component.extend({
	tag: "tournament-details",
	template: require("./details.stache!"),
	viewModel: exports.ViewModel
});
