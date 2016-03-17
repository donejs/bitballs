/**
 * @module {Module} bitballs/components/navigation <bitballs-navigation>
 * @parent bitballs.components
 *
 * @group bitballs/components/navigation.properties properties
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
var Component = require("can/component/component");
var stache = require("can/view/stache/");
var route = require("can/route/");
var Session = require("bitballs/models/session");
var User = require("bitballs/models/user");
var $ = require("jquery");
var CanMap = require("can/map/");

require("bootstrap/dist/css/bootstrap.css!");
require("bootstrap/js/dropdown");
require("can/route/");
require("./navigation.less!");


var ViewModel = CanMap.extend(
/** @prototype */
{
	define: {
		/**
		 * @property {bitballs/models/session} bitballs/components/navigation.loginSession loginSession
		 * @parent bitballs/components/navigation.properties
		 */
		loginSession: {
			value: function(){
				return new Session({user: new User()});
			}
		}
		/**
		 * @property {bitballs/app} bitballs/components/navigation.app app
		 * @parent bitballs/components/navigation.properties
		 */
	},
	/**
	 * @function createSession
	 */
	createSession: function(ev){
		ev.preventDefault();
		var self = this;
		var sessionPromise = this.attr("loginSession").save().then(function(session){

			self.attr("loginSession", new Session({user: new User()}));
			self.attr("app").attr("session", session);

		});
		this.attr("sessionPromise", sessionPromise);
	},
	/**
	 * @function logout
	 */
	logout: function(){
		this.attr("app").attr("session").destroy();
		this.attr("app").attr("session", null);
	},
	/**
	 * @function closeDropdown
	 */
	closeDropdown: function ( el ) {
		$( el ).closest( ".session-menu" ).find( ".open .dropdown-toggle" ).dropdown( "toggle" );
	}
});

Component.extend({
	tag: "bitballs-navigation",
	template: require("./navigation.stache!"),
	viewModel: ViewModel
});

exports.ViewModel = ViewModel;
