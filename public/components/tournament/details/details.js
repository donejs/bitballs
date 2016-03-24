/**
 * @module {Module} bitballs/components/tournament/details <tournament-details>
 * @parent bitballs.components
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

/**
 * @constructor bitballs/components/tournament/details.ViewModel ViewModel
 * @parent bitballs/components/tournament/details
 *
 * @description  A `<tournament-details>` component's viewModel.
 */

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
		tournamentPromise: {
			get: function(){
				return Tournament.get({id: this.attr("tournamentId")});
			}
		},
		/**
		* @property {Boolean}
		*
		* Configures whether or not admin specific features are enabled.
		**/
		isAdmin: {
			type: 'boolean',
			value: false
		},
		/**
		* @property {Number} tournamentId
		*
		* The `id` used to fetch the [bitballs/models/tournament] model.
		**/
		/**
		* @property {Boolean}
		*
		* The [bitballs/models/tournament] model that the component is bound to.
		**/
		tournament: {
			get: function(lastSet, setVal){
				this.attr('tournamentPromise').then(setVal);
			}
		},
		/**
		* @property {Promise<bitballs/models/game.static.List>}
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
		* @property {bitballs/models/game.static.List}
		*
		* A [bitballs/models/game.static.List Game List] instance.
		**/
		games: {
			get: function(lastSet, setVal){
				this.attr("gamesPromise").then(setVal);
			}
		},
		/**
		* @property {Number}
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
		* @property {Promise<bitballs/models/team.static.List>}
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
		* @property {bitballs/models/team.static.List}
		*
		* A [bitballs/models/team.static.List Team List] instance.
		**/
		teams: {
			get: function(lastSet, setVal){
				this.attr("teamsPromise").then(setVal);
			}
		},
		// TODO: Make this a Team.List method
		/**
		* @property {Array}
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
		* @property {bitballs/models/game}
		*
		* A [bitballs/models/game] instance.
		**/
		game: {
			Value: Game
		},
		/**
		* @property {bitballs/models/team}
		*
		* A [bitballs/models/team] instance.
		**/
		team: {
			Value: Team
		},
		/**
		* @property {Promise<bitballs/models/player.static.List>}
		*
		* A promise that resolves to a [bitballs/models/player.static.List Team List].
		**/
		playersPromise: {
			value: function(){
				return Player.getList({orderBy: "name"});
			}
		},
		/**
		* @property {Player.List}
		*
		* A [bitballs/models/player.static.List Player List] instance.
		**/
		players: {
			get: function(set, resolve){
				this.attr("playersPromise").then(resolve);
			}
		},
		// TODO: Make this a Player.List method
		/**
		* @property {Object}
		*
		* A map of [bitballs/models/player.prototype.id player id]'s to [bitballs/models/player] models.
		**/
		playerIdMap: {
			type: "*",
			get: function(){
				var map = {},
					players = this.attr("players");

				if(players) {
					players.each(function(player){
						map[player.attr("id")] = player;
					});
				}

				return map;
			}
		},
		/**
		* @property {String|null}
		*
		* The round selection made by the user.
		**/
		userSelectedRound: {
			value: null
		},
		/**
		* @property {String}
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
		* @property {String|null}
		*
		* The court selection made by the user.
		**/
		userSelectedCourt: {
			value: null
		},
		/**
		* @property {String}
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
		* @property {Object}
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
	},

	/**
	 * @function
	 * @description Delete a game from the database.
	 * @param {bitballs/models/game} game The [bitballs/models/game] to delete.
	 * @param {String} confirmMessage The message presented to the user in a `confirm()` dialog.
	 *
	 * @body
	 *
	 * Use in a template like:
	 * ```
	 * <span class="destroy-btn" ($click)="deleteGame(., "Are you sure?")"></span>
	 * ```
	 */
	deleteGame: function (game, confirmMessage) {
		if (! window.confirm(confirmMessage)) {
			return;
		}
		game.destroy();
	},

	/**
	 * @function
	 * @description Delete a team from the database.
	 * @param {bitballs/models/team} team The [bitballs/models/team] to delete.
	 * @param {String} confirmMessage The message presented to the user in a `confirm()` dialog.
	 *
	 * @body
	 *
	 * Use in a template like:
	 * ```
	 * <span class="destroy-btn" ($click)="deleteTeam(., "Are you sure?")"></span>
	 * ```
	 */
	deleteTeam: function (team, confirmMessage) {
		if (! window.confirm(confirmMessage)) {
			return;
		}
		team.destroy();
	}
});

/**
 * @property bitballs/components/tournament/details.helpers helpers
 * @parent bitballs/components/tournament/details
 * @description  A `<tournament-details>` component's stache helpers.
 */

exports.Component = Component.extend({
	tag: "tournament-details",
	template: require("./details.stache!"),
	viewModel: exports.ViewModel,
	helpers: {
		/**
		 * @function bitballs/components/tournament/details.helpers.playerById playerById
		 * @parent bitballs/components/tournament/details.helpers
		 *
		 * Gets a [bitballs/models/player] model from a [bitballs/models/team]
		 * model by its `id`.
		 *
		 * @param {can.Compute} id A player ID.
		 * @param {Object} options Helper options.
		 **/
		playerById: function(id, options){
			var idVal = id();
			if(idVal != null) {
				return options.fn( this.attr("playerIdMap")[idVal] );
			} else {
				return;
			}

		},
		/**
		 * @function bitballs/components/tournament/details.helpers.teamById teamById
		 * @parent bitballs/components/tournament/details.helpers
		 *
		 * Gets a [bitballs/models/team] model from a [bitballs/models/game]
		 * model by its `id`.
		 *
		 * @param {can.Compute} id A team ID.
		 * @param {Object} options Helper options.
		 **/
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
