/**
 * @module {Module} bitballs/components/navigation <bitballs-navigation>
 * @parent bitballs.components
 *
 * @description Provides navigation between different parts of the app
 * and lets a user login or logout.
 *
 * @signature `<bitballs-navigation {app}/>`
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
 *     />
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

require("bootstrap/dist/css/bootstrap.css!");
require("bootstrap/js/dropdown");
require("can/route/");
require("can/view/href/");
require("./navigation.less!");

stache.registerHelper();

Component.extend({
	tag: "bitballs-navigation",
	template: require("./navigation.stache!"),
	viewModel: {
		define: {
			loginSession: {
				value: function(){
					return new Session({user: new User()});
				}
			}
		},
		createSession: function(ev){
			ev.preventDefault();
			var self = this;
			var sessionPromise = this.attr("loginSession").save().then(function(session){

				self.attr("loginSession", new Session({user: new User()}));
				self.attr("app").attr("session", session);

			});
			this.attr("sessionPromise", sessionPromise);
		},
		logout: function(){
			this.attr("app").attr("session").destroy();
			this.attr("app").attr("session", null);
		},
		closeDropdown: function ( el ) {
			$( el ).closest( ".session-menu" ).find( ".open .dropdown-toggle" ).dropdown( "toggle" );
		}
	}
});
