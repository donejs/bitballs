/**
 * @module {Module} bitballs/components/player/list <player-list>
 * @parent bitballs.components
 *
 * @group bitballs/components/player/list.properties 0 properties
 *
 * @description Provides links to the existing [bitballs/models/player]s. Enables logged
 * in admin users to create, update, and destroy [bitballs/models/player]s.
 *
 * @signature `<player-list {is-admin} />`
 *   Renders a list of [bitballs/models/player] models.
 *
 *   @param {Boolean} is-admin Configures whether or not admin specific
 *   features are enabled.
 *
 *
 * @body
 *
 * To create a `<player-list>` element pass a boolean like [bitballs/app.prototype.isAdmin]:
 *
 * ```
 * <player-list
 *     {is-admin}="app.isAdmin" />
 * ```
 *
 * ## Example
 *
 * @demo public/components/player/list/list.html
 *
 **/
import { Component, DefineMap } from "can";
import Player from "bitballs/models/player";
import view from "./list.stache";
import "bootstrap/dist/css/bootstrap.css";

export const ViewModel = DefineMap.extend('PlayerListVM',
{
	/**
	 * @property {Boolean} bitballs/components/player/list.isAdmin isAdmin
	 * @parent bitballs/components/player/list.properties
	 *
	 * Configures whether or not admin specific features are enabled.
	 **/
	isAdmin: {
		type: 'boolean',
		default: false
	},
	/**
	 * @property {bitballs/models/Player} bitballs/models/player editingPlayer
	 *
	 * holds the current player instance that is being edited
	 */
	editingPlayer: {Type: Player, default: null},
	/**
	 * @property {Promise<bitballs/models/player>} bitballs/components/player/list.playersPromise playersPromise
	 * @parent bitballs/components/player/list.properties
	 *
	 * A [bitballs/models/player] model List.
	 */
	playersPromise: {
		default: function(){
			return Player.getList({orderBy: "name"});
		}
	},
	/**
	 * @function editPlayer
	 *
	 * Selects a [bitballs/models/player] model for editing.
	 *
	 * @param {bitballs/models/player} player
	 *   The player model that will be passed to the `<player-edit>`
	 *   component.
	 */
	editPlayer: function(player){
		player.backup();
		this.editingPlayer = player;
	},
	/**
	 * @function removeEdit
	 *
	 * Deselects the [bitballs/models/player] model being edited.
	 */
	removeEdit: function(){
		this.editingPlayer = null;
	},
	/**
	 * @function
	 * @description Delete a player from the database.
	 * @param {bitballs/models/player} player The [bitballs/models/player] to delete.
	 *
	 * @body
	 *
	 * Use in a template like:
	 * ```
	 * <span class="destroy-btn" ($click)="deletePlayer(.)"></span>
	 * ```
	 */
	deletePlayer: function (player) {
		if (! window.confirm('Are you sure you want to delete this player?')) {
			return;
		}
		player.destroy();
	}
});

export const PlayerList = Component.extend({
	tag: "player-list",
	view,
	ViewModel
});

export { PlayerList as Component };
