/**
 * @module {Module} bitballs/components/player/edit <player-edit>
 * @parent bitballs.components
 *
 * @group bitballs/components/player/edit.properties 0 properties
 *
 * @description Provides an interface for editing the values of a
 * [bitballs/models/player] model.
 *
 * @signature `<player-edit {is-admin} />`
 *   Creates a form with inputs for each property in a [bitballs/models/player] model.
 *
 *   @param {Boolean} is-admin Configures whether or not admin specific
 *   features are enabled.
 *
 *
 * @body
 *
 * To create a `<player-edit>` element pass a boolean like [bitballs/app.prototype.isAdmin]:
 *
 * ```
 * <player-edit
 *     {is-admin}="app.isAdmin" />
 * ```
 *
 * ## Example
 *
 * @demo public/components/player/edit/edit.html
 *
 **/
var Component = require("can-component");
var Player = require("bitballs/models/player");
var DefineMap = require("can-define/map/map");

require("bootstrap/dist/css/bootstrap.css!");
require('can-define-backup');
require("can-construct");


exports.ViewModel = DefineMap.extend("PlayerEditVM",
{
	/**
	* @property {Boolean} bitballs/components/player/edit.isAdmin isAdmin
	* @parent bitballs/components/player/edit.properties
	*
	* Configures whether or not admin specific features are enabled.
	**/
	isAdmin: {
		type: 'boolean',
		value: false
	},
	/**
	* @property {bitballs/models/player} bitballs/components/player/edit.player player
	* @parent bitballs/components/player/edit.properties
	*
	* The model that will be bound to the form.
	**/
	player: {
		Type: Player,
		value: Player
	},
	/**
	 * @property {Promise<bitballs/models/player>} bitballs/components/player/edit.savePromise savePromise
	 * @parent bitballs/components/player/edit.properties
	 *
	 * A [bitballs/models/player] model.
	 */
	savePromise: 'any',
	/**
	 * @function savePlayer
	 *
	 * Creates/updates the player on the server and when successful sets [bitballs/components/player/edit.player]
	 * to a new [bitballs/models/player] model. Fires a "saved" event.
	 *
	 * @param {Event} [ev] A DOM Level 2 event that [`preventDefault`](https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault)
	 * will be called on.
	 *
	 * @return {Promise<bitballs/models/player>}
	 */
	savePlayer: function(ev){
		if (ev) {
			ev.preventDefault();
		}

		var self = this;
		var player = this.player;
		var promise;

		if(player.isNew()) {
			promise = player.save().then(function(){
				self.player = new Player();
			});
		} else {
			promise = player.save();
		}

		promise.then(function(){
			player.backup();
			self.dispatch("saved");
		});

		this.savePromise = promise;

		return promise;
	},
	/**
	 * @function cancel
	 *
	 * Restores the [bitballs/models/player] model to its state prior to editing.
	 * Fires a "canceled" event.
	 */
	cancel: function() {
		this.player = this.player.restore();
		this.dispatch("canceled");
	}
});

exports.Component = Component.extend({
	tag: "player-edit",
	view: require("./edit.stache!"),
	ViewModel: exports.ViewModel
});
