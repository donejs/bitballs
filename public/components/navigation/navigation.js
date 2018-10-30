/**
 * @module {Module} bitballs/components/navigation <bitballs-navigation>
 * @parent bitballs.components
 *
 * @group bitballs/components/navigation.properties 0 properties
 *
 * @description Provides navigation between different parts of the app
 * and lets a user login or logout.
 *
 * @signature `<bitballs-navigation {app}/>`
 *   Creates the navigation for Bitballs.
 *
 *   @param {bitballs/app} app The application viewModel.  This component
 *   will read and set the `session` property on the [bitballs/app].
 *
 *
 * @body
 *
 * To create a `<game-details>` element pass the [bitballs/models/session]
 * and a [bitballs/models/game] id like:
 *
 * ```
 * <bitballs-navigation
 *     {app}="." />
 * ```
 *
 * ## Example
 *
 * @demo public/components/navigation/navigation.html
 *
 */
import { Component, DefineMap } from "can";
import Session from "bitballs/models/session";
import User from "bitballs/models/user";
import view from "./navigation.stache";
import $ from "jquery";
steal.loader.global.jQuery = $;

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/js/dropdown";
import "./navigation.less";


var ViewModel = DefineMap.extend('NavigationVM',
{
	/**
	 * @property {bitballs/app} bitballs/components/navigation.app app
	 * @parent bitballs/components/navigation.properties
	 *
	 * The [bitballs/app] used to add or destroy the session.
	 */
	app:  'any',
	/**
	* @property {Promise<bitballs/models/session>} bitballs/components/navigation.sessionPromise sessionPromise
	* @parent bitballs/components/navigation.properties
	*
	* The promise that resolves when the user is logged in.
	*/
	sessionPromise: 'any',
	/**
	 * @property {bitballs/models/session} bitballs/models/session session
	 *
	 * Current session for the app
	 */
	session: Session,
	/**
	 * @property {bitballs/models/session} bitballs/components/navigation.loginSession loginSession
	 * @parent bitballs/components/navigation.properties
	 *
	 * A placeholder session with a nested [bitballs/models/user user] property that
	 * is used for two-way binding the login form's username and password.
	 */
	loginSession: {
		default: function(){
			return new Session({user: new User()});
		}
	},
	/**
	 * @function createSession
	 *
	 * Creates the session on the server and when successful updates [bitballs/components/navigation.app]
	 * with the session. Sets [bitballs/components/navigation.sessionPromise].
	 * @param {Event} [ev] Optional DOM event that will be prevented if passed.
	 */
	createSession: function(ev){
		if(ev) {
			ev.preventDefault();
		}
		var self = this;
		var sessionPromise = this.loginSession.save().then(function(session){
			self.loginSession = new Session({user: new User()});
			self.app.session = session;
		});
		this.sessionPromise = sessionPromise;
	},
	/**
	 * @function logout
	 *
	 * Destroys [bitballs/components/navigation.app]'s [bitballs/models/session] and
	 * then removes it from the session.
	 */
	logout: function(){
		var sessionPromise = this.app.session.destroy();
		this.sessionPromise = sessionPromise;
		this.app.session = null;
	},
	/**
	 * @function closeDropdown
	 * Closes the dropdown.  Needed for when someone clicks on register.
	 */
	closeDropdown: function ( el ) {
		$( el ).closest( ".session-menu" ).find( ".open .dropdown-toggle" ).dropdown( "toggle" );
	}
});

const Navigation = Component.extend({
	tag: "bitballs-navigation",
	view,
	ViewModel
});

export { Navigation, Navigation as Component, ViewModel };
