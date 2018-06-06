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
import CanComponent from "can-component";
import Team from "bitballs/models/team";
import Game from "bitballs/models/game";
import Player from "bitballs/models/player";
import Tournament from "bitballs/models/tournament";
import Stat from "bitballs/models/stat";
import Session from "bitballs/models/session";
import DefineMap from "can-define/map/map";

import defineStreamKefir from "can-define-stream-kefir";
import "bootstrap/dist/css/bootstrap.css!";
import "can-stache-route-helpers";
import tournamentDetailsView from "./details.stache";

export const ViewModel = DefineMap.extend('TournamentDetails',
{
	// when we create a team, we save the promise to know if there's an error
	teamSavePromise: {type: "any"},
   /**
	* @property {Promise<bitballs/models/tournament>} bitballs/components/tournament/details.tournamentPromise tournamentPromise
	* @parent bitballs/components/tournament/details.properties
	*
	* Configures whether or not admin specific features are enabled.
	**/
	get tournamentPromise() {
		return Tournament.get({id: this.tournamentId });
	},
	/**
	* @property {Boolean} bitballs/components/tournament/details.isAdmin isAdmin
	* @parent bitballs/components/tournament/details.properties
	*
	* Configures whether or not admin specific features are enabled.
	**/
	isAdmin: {
		type: 'boolean',
		default: false
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
	get gamesPromise() {
		return Game.getList({
			where: {tournamentId: this.tournamentId}
		});
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
	get gamesLength() {
		return this.games ? this.games.length : 0;
	},
	/**
	* @property {Promise<bitballs/models/team.static.List>} bitballs/components/tournament/details.teamsPromise teamsPromise
	* @parent bitballs/components/tournament/details.properties
	*
	* A promise that resolves to a [bitballs/models/team.static.List Team List] based on
	* [bitballs/components/tournament/details.ViewModel.prototype.tournamentId tournamentId].
	**/
	get teamsPromise() {
		return Team.getList({
			where: {tournamentId: this.tournamentId}
		});
	},
	/**
	* @property {bitballs/models/team.static.List} bitballs/components/tournament/details.teams teams
	* @parent bitballs/components/tournament/details.properties
	*
	* A [bitballs/models/team.static.List Team List] instance.
	**/
	teams: {
		get: function(lastSet, resolve){
			this.teamsPromise.then(resolve);
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
	get availableColors() {
		var teams = this.teams;
		if(!teams) {
			return Team.colors;
		} else {
			var allColors = Team.colors.slice(0);
			teams.forEach(function(team){
				var index = allColors.indexOf(team.color);
				if(index !== -1) {
					allColors.splice(index, 1);
				}
			});
			return allColors;
		}
	},
	/**
	* @property {Array} bitballs/components/tournament/details.courtNames courtNames
	* @parent bitballs/components/tournament/details.properties
	*
	* A list of courtNames from the [bitballs/models/game.static.courtNames courtNames]
	* list that are available.
	**/
	get courtNames() {
		return Game.courtNames;
	},
	/**
	* @property {bitballs/models/game} bitballs/components/tournament/details.game game
	* @parent bitballs/components/tournament/details.properties
	*
	* A [bitballs/models/game] instance used to create a `Game`.
	**/
	game: {
		Default: Game
	},
	/**
	* @property {bitballs/models/session} bitballs/components/tournament/details.session session
	* @parent bitballs/components/tournament/details.properties
	*
	* A [bitballs/models/session] instance used to track a `Session`
	**/
	session: Session,
	/**
	* @property {bitballs/models/team} bitballs/components/tournament/details.team team
	* @parent bitballs/components/tournament/details.properties
	*
	* A [bitballs/models/team] instance used to create a `Team`.
	**/
	team: {
		Default: Team
	},
	/**
	* @property {Promise<bitballs/models/player.static.List>} bitballs/components/tournament/details.playersPromise playersPromise
	* @parent bitballs/components/tournament/details.properties
	*
	* A promise that resolves to a [bitballs/models/player.static.List Team List].
	**/
	playersPromise: {
		default: function(){
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
	* @property {Promise<bitballs/models/stat.static.List>} bitballs/components/player/details.statPromise statsPromise
	* @parent bitballs/components/player/details.properties
	*
	* A promise that fetches a [bitballs/models/stat.static.List stat List] based on
	* [bitballs/components/player/details.ViewModel.prototype.playerId playerId].
	**/
	get statsPromise() {
	  // currently, we can't request stats through a multi-relationship
	  return Stat.getList({
		// where: {tournamentId: this.tournamentId},
	  });
	},
	/**
	* @property {bitballs/models/stat.static.List} bitballs/components/player/details.stat stat
	* @parent bitballs/components/player/details.properties
	*
	* A [bitballs/models/stat.static.List stat List] instance.
	**/
	stats: {
	  get: function(lastSet, resolve){
		if (!this.games) {
			return;
		}

		let games = [];
		this.games.forEach(({ id }) => games.push(id));

		this.statsPromise.then((stats) => {
			stats = stats.filter(({ gameId }) =>
				games.includes(gameId)
			);

			resolve(stats);
		});
	  }
	},
	/**
	* @property {String} bitballs/components/tournament/details.selectedRound selectedRound
	* @parent bitballs/components/tournament/details.properties
	*
	* The user selected round
	* or the first value in the list returned from [bitballs/models/game.static.List.prototype.getAvailableRounds getAvailableRounds].
	**/
	selectedRound: {
		value({lastSet, resolve, listenTo}) {
			listenTo("firstAvailableRound", (ev, firstAvailableRound) => {
				resolve(firstAvailableRound);
			});
			// initial firstAvailableRound
			resolve(this.firstAvailableRound);
			listenTo(lastSet, function(lastSetRound){
				resolve(lastSetRound);
			})
		}
		/*stream: function(setStream) {
			var firstAvailableRoundStream = this.stream('.firstAvailableRound');
			return setStream.merge(firstAvailableRoundStream);
		}*/
	},
	get firstAvailableRound() {
		var availableRounds = this.games && this.games.getAvailableRounds()[0];
		return availableRounds;
	},
	/**
	* @property {String|null} bitballs/components/tournament/details.userSelectedCourt userSelectedCourt
	* @parent bitballs/components/tournament/details.properties
	*
	* The court selection made by the user.
	**/
	userSelectedCourt: {
		default: null
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
		value({lastSet, resolve, listenTo}) {
			// we need the list of games
			var games;
			listenTo("games", function(ev, loadedGames){
				games = loadedGames;
			});
			games = this.games;

			var lastSelectedCourt = resolve("1");

			// if selectedRound changes, we should translate to an
			// available selected court
			listenTo("selectedRound", (ev, selectedRound) => {
				// if we haven't loaded games ... then just ignore for now
				if(games) {
					// court names are strings
					var availableCourts = games.getAvailableCourts(selectedRound);
					// if the currentCourt is still available
					if( availableCourts.indexOf(lastSelectedCourt) >= 0 ) {
						// do nothing
					} else {
						lastSelectedCourt = resolve(availableCourts[0]);
					}
				}
			});

			listenTo(lastSet, function(lastSetCourt){

				lastSelectedCourt = resolve(lastSetCourt);
			});
		}
		/*stream: function(setStream) {
			var vm = this;


			var selectedRoundEvent = this.stream("selectedRound");
			var setSelectedCourtEvent = setStream.map(function(selectedCourt){
				return {type: "selectedCourt", default: selectedCourt};
			});

			return setSelectedCourtEvent.merge(selectedRoundEvent).scan(function(selectedCourt, event){
				if(event.type === "selectedCourt") {
					return event.value;
				}
				if(event.type === "selectedRound") {
					var availableCourts = vm.games && vm.games.getAvailableCourts(vm.selectedRound);
					if(availableCourts) {
						// make sure it's ok
						if(availableCourts[selectedCourt-1]) {
							return selectedCourt;
						}
						return availableCourts[0];
					}

				}
			},"1");
		}*/
	},
	/**
	* @property {Object} bitballs/components/tournament/details.teamIdMap teamIdMap
	* @parent bitballs/components/tournament/details.properties
	*
	* A map of [bitballs/models/team.prototype.id team id]'s to [bitballs/models/team] models.
	**/
	get teamIdMap() {
		var map = {};
		var teams = this.teams;
		if(teams) {
			teams.forEach(function(team){
				map[team.id] = team;
			});
		}

		return map;
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
			oppositeId = this.game[opposite+"TeamId"];

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

			teams.forEach(function(tm){
				if(tm !== team) {
					[1,2,3,4].forEach(function(index){
						usedIds[tm["player"+index+"Id"]] = true;
					});
				}
			});


			[1,2,3,4].forEach(function(index){
				if(index !== number) {
					usedIds[team["player"+index+"Id"]] = true;
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
			this.team.color = this.availableColors[0];
		}
		this.team.tournamentId = this.tournamentId;

		this.teamSavePromise = this.team.save(function(){
			self.team = new Team();
		});

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

		game.set({
			round: this.selectedRound,
			court: this.selectedCourt,
			tournamentId: this.tournamentId
		});

		game.save(function(){
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

defineStreamKefir(ViewModel);

export const Component = CanComponent.extend({
	tag: "tournament-details",
	view: tournamentDetailsView,
	ViewModel: ViewModel
});
