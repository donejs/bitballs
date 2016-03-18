/**
 * @module {can.Map} bitballs/app AppViewModel
 * @parent bitballs
 *
 * @group bitballs/app.properties 0 properties
 */
import Map from "can/map/";
import "can/map/define/";
import "bootstrap/dist/css/bootstrap.css!";
import route from 'can/route/';
import Session from './models/session';
import "can/route/pushstate/";
import stache from "can/view/stache/";
import "./util/prefilter";

const AppViewModel = Map.extend(
/** @prototype */
{
	define: {
		title: {
			get: function(){
				return "BitBalls | " + this.attr('pageComponentConfig').title;
			}
		},
		pageComponentConfig: {
			get: function(){
				if(this.attr("gameId")) {
					return {
						title: "Game",
						componentName: "game-details",
						attributes: "{(game-id)}='../gameId' {(session)}='../session'",
						moduleName: "game/details/"
					};

				} else if(this.attr("tournamentId")) {
					return {
						title: "Tournament",
						componentName: "tournament-details",
						attributes: "{tournament-id}='../tournamentId' {session}='../session'",
						moduleName: "tournament/details/"
					};

				} else if(this.attr("page") === "tournaments") {
					return {
						title: "Tournaments",
						componentName: "tournament-list",
						attributes: "{is-admin}='app.isAdmin'",
						moduleName: "tournament/list/"
					};

				} else if(this.attr("page") === "users") {
					return {
						title: "Users List",
						componentName: "user-list",
						attributes: "{(session)}='../session'",
						moduleName: "user/list/"
					};

				} else if(this.attr("page") === "register" || this.attr("page") === "account") {
					return {
						title: "Account",
						componentName: "user-details",
						attributes: "{(session)}='../session'",
						moduleName: "user/details/"
					};

				} else {
					return {
						title: "Players",
						componentName: "player-list",
						attributes: "{(session)}='../session'",
						moduleName: "player/list/"
					};

				}
			}
		},
		/**
		* @property {bitballs/models/session} bitballs/app.session session
		* @parent bitballs/app.properties
		**/
		session: {
			serialize: false,
			value: function() {
				var self = this;
				Session.get({}).then(function(session){
					self.attr("session", session);
				});
			}
		},
		tournamentId: {type: "number"}
	},
	/**
	 * @function isAdmin
     *
	 * @return {Boolean} The value of `user.isAdmin` on the [bitballs/app.session]
	 * model, if present. Otherwise, `false`.
	 */
	isAdmin: function(){
		var session = this.attr("session");
		if(session) {
			if(session.attr("user")) {
				return session.attr("user").attr("isAdmin");
			} else {
				return false;
			}
		}
		return false;
	}
});

stache.registerHelper("pageComponent", function(options){
	var pageComponent = options.context.attr("pageComponentConfig"),
		template =
			"<can-import from='bitballs/components/" + pageComponent.moduleName + "'>" +
				"{{#if isResolved}}" +
					"<"+pageComponent.componentName + " " + pageComponent.attributes + "/>" +
				"{{else}}" +
					"Loading..." +
				"{{/if}}" +
			"</can-import>";


	return stache(template)(this, options.helpers, options.nodeList);
});

route('tournaments/:tournamentId');
route('games/:gameId');
route(':page',{page: 'tournaments'});

export default AppViewModel;
