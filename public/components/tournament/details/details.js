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
var Component = require("can-component");
var DefineMap = require("can-define/map/");
var Team = require("bitballs/models/team");
var Game = require("bitballs/models/game");
var Player = require("bitballs/models/player");
var Tournament = require("bitballs/models/tournament");

require("can-stream");
require("can-define-stream");
require("bootstrap/dist/css/bootstrap.css!");
require("can-route");

exports.ViewModel = DefineMap.extend(
/** @prototype */
{
	/**
	* @property {Promise<bitballs/models/tournament>} bitballs/components/tournament/details.tournamentPromise tournamentPromise
	* @parent bitballs/components/tournament/details.properties
	*
	* Configures whether or not admin specific features are enabled.
	**/
	tournamentPromise: {
		get: function(){
			return Tournament.get({id: this.tournamentId});
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
			this.tournamentPromise.then(setVal);
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
				where: {tournamentId: this.tournamentId}
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
			this.gamesPromise.then(setVal);
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
			return this.games.length;
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
				where: {tournamentId: this.tournamentId}
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
			this.teamsPromise.then(setVal);
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
			var teams = this.teams;
			if(!teams) {
				return Team.colors;
			} else {
				var allColors = Team.colors.slice(0);
				teams.each(function(team){
					var index = allColors.indexOf(team.color);
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
			this.playersPromise.then(resolve);
		}
	},
	/**
	* @property {String} bitballs/components/tournament/details.selectedRound selectedRound
	* @parent bitballs/components/tournament/details.properties
	*
	* The [bitballs/components/tournament/details.ViewModel.prototype.userSelectedRound userSelectedRound]
	* or the first value in the list returned from [bitballs/models/game.static.List.prototype.getAvailableRounds getAvailableRounds].
	**/
	selectedRound: {
		type: 'string',
		stream: function(stream) {
			var vm = this;
			var gamesLengthStream = this.stream('games.length');
			return stream.map(function(value) {
				var availableRounds = vm.games && vm.games.getAvailableRounds()[0];
				return availableRounds;
			}).merge(gamesLengthStream);
		}
		// stream: ['games.length', function (gamesLengthStream) {
		// 	var vm = this;
		// 	return gamesLengthStream.map(function (value) {
		// 		var availableRounds = vm.games && vm.games.getAvailableRounds()[0];
		// 		return availableRounds;
		// 	})
		// }]
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
		stream: function(stream) {
			var vm = this;
			var selectedRoundStream = this.stream('selectedRound');
			var gamesLengthStream = this.stream('games.length');
			return stream.merge(selectedRoundStream).merge(gamesLengthStream).map(function(value){
				var selectedCourt = vm.games && vm.games.getAvailableCourts(vm.selectedRound)[0];
				return selectedCourt;
			});
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
			var teams = this.teams;
			if(teams) {
				teams.each(function(team){
					map[team.id] = team;
				});
			}

			return map;
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
		var teams = this.teams;
		var games = this.games;
		if(!games || !teams) {
			return [];
		}

		if(!round) {
			return teams;
		}
		// Re-evaluate if teams are added/removed
		teams.length;
		var remainingTeams = teams.slice(0);

		games.forEach(function(game){
			// TODO: Get a reference to the games in this round more quickly
			// using `gamesGroupedByRound` instead of iterating
			if(game.round === round) {
				remainingTeams.removeById(game.homeTeamId);
				remainingTeams.removeById(game.awayTeamId);
			}
		});

		var opposite = name === "home" ? "away" : "home",
			oppositeId = this.game.attr(opposite+"TeamId");

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

		var allPlayers = this.players,
			teams = this.teams;
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
				return !usedIds[player.id];
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
		if(!this.team.color){
			this.team.attr("color", this.availableColors[0]);
		}

		var teamSavePromise = this.team.attr("tournamentId", this.tournamentId)
			.save(function(){
			self.team = new Team();
		});

		this.teamSavePromise = teamSavePromise;
	},
	Game: {
		value: function () {
			return Game
		}
	},
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
		var game = this.game;
		
		game.attr({
			round: this.selectedRound,
			court: this.selectedCourt,
			tournamentId: this.tournamentId
		}).save(function(){
			self.game = new Game();
		});
	},

	/**
	 * @function
	 * @description Delete a game from the database.
	 * @param {bitballs/models/game} game The [bitballs/models/game] to delete.
	 *
	 * @body
	 *
	 * Use in a template like:
	 * ```
	 * <span class="destroy-btn" ($click)="deleteGame(.)"></span>
	 * ```
	 */
	deleteGame: function (game) {
		if (! window.confirm('Are you sure you want to delete this game?')) {
			return;
		}
		game.destroy();
	},

	/**
	 * @function
	 * @description Delete a team from the database.
	 * @param {bitballs/models/team} team The [bitballs/models/team] to delete.
	 *
	 * @body
	 *
	 * Use in a template like:
	 * ```
	 * <span class="destroy-btn" ($click)="deleteTeam(.)"></span>
	 * ```
	 */
	deleteTeam: function (team) {
		if (! window.confirm('Are you sure you want to delete this team?')) {
			return;
		}
		team.destroy();
	}
});

exports.Component = Component.extend({
	tag: "tournament-details",
	template: require("./details.stache!"),
	viewModel: exports.ViewModel,
});
