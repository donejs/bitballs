/**
 * @module {Module} bitballs/components/tournament/list <tournament-list>
 * @parent bitballs.components
 *
 * @group bitballs/components/tournament/list.properties 0 properties
 *
 * @description Provides links to the existing tournaments. Enables logged
 * in admin users to create and destroy tournaments.
 *
 * @signature `<tournament-list {is-admin}/>`
 *   Renders a list of tournaments.
 *
 *   @param {Boolean} is-admin Configures whether or not admin specific
 *   features are enabled.
 *
 *
 * @body
 *
 * To create a `<tournament-list>` element pass a boolean like [bitballs/app.prototype.isAdmin]:
 *
 * ```
 * <tournament-list
 *     {is-admin}="app.isAdmin" />
 * ```
 *
 * ## Example
 *
 * @demo public/components/tournament/list/list.html
 *
 */
var Component = require("can/component/component");
var CanMap = require("can/map/");
var Tournament = require("bitballs/models/tournament");

require("bootstrap/dist/css/bootstrap.css!");
require("can/map/define/");
require("can/route/");
require("can/view/href/");

exports.ViewModel = CanMap.extend(
/** @prototype */
{
	define: {
		/**
		* @property {bitballs/models/tournament} bitballs/components/tournament/list.tournament tournament
		* @parent bitballs/components/tournament/list.properties
		*
		* The [bitballs/models/tournament] model that backs the tournament
		* creation form.
		**/
		tournament: {
			Type: Tournament,
			Value: Tournament
		},
		/**
		* @property {Boolean} bitballs/components/tournament/list.isAdmin isAdmin
		* @parent bitballs/components/tournament/list.properties
		*
		* Configures whether or not admin specific features are enabled.
		**/
		isAdmin: {
			type: 'boolean',
			value: false,
		},
		/**
		* @property {Promise<Tournament>} bitballs/components/tournament/list.savePromise savePromise
		* @parent bitballs/components/tournament/list.properties
		*
		* A promise that resolves when [bitballs/component/tournament/list.prototype.createTournament]
		* is called and the [bitballs/models/tournament] model is persisted to the server.
		**/
	},
	/**
	 * @function createTournament
	 *
	 * @description Creates the tournament on the server and when successful sets
	 * [bitballs/components/tournament/list.tournament] to a new [bitballs/models/tournament] model.
	 *
	 * @param {Event} [ev] A DOM Level 2 event.
     *
	 * @return {Promise<Tournament>} A [bitballs/models/tournament] model.
	 */
	createTournament: function(ev) {
		if (ev) {
			ev.preventDefault();
		}
		var self = this;

		var promise = this.attr("tournament").save().then(function(player) {
			self.attr("tournament", new Tournament());
		});

		this.attr("savePromise", promise);

		return promise;
	},
	/**
	 * @function
	 * @description Delete a tournament from the database.
	 * @param {bitballs/models/tournament} tournament The [bitballs/models/tournament] to delete.
	 * @param {String} confirmMessage The message presented to the user in a `confirm()` dialog.
	 *
	 * @body
	 *
	 * Use in a template like:
	 * ```
	 * <span class="destroy-btn" ($click)="deleteTournament(., "Are you sure?")"></span>
	 * ```
	 */
	deleteTournament: function (tournament, confirmMessage) {
		if (! window.confirm(confirmMessage)) {
			return;
		}
		tournament.destroy();
	}
});

exports.Component = Component.extend({
	tag: "tournament-list",
	template: require("./list.stache!"),
	viewModel: exports.ViewModel,
	leakScope: false
});
