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
				var page = this.attr("page");
				if(this.attr("gameId")) {
					return {
						title: "Game",
						componentName: "game-details",
						attributes: "{(game-id)}='../gameId'  {(session)}='../session' {(game-promise)}='../pagePromise'",
						moduleName: "game/details/"
					};

				} else if(this.attr("tournamentId")) {
					return {
						title: "Tournament",
						componentName: "tournament-details",
						attributes: "{tournament-id}='../tournamentId' {is-admin}='../isAdmin' {(tournament-promise)}='../pagePromise'",
						moduleName: "tournament/details/"
					};

				} else if(page === "tournaments") {
					return {
						title: "Tournaments",
						componentName: "tournament-list",
						attributes: "{is-admin}='../isAdmin'",
						moduleName: "tournament/list/"
					};

				} else if(page === "users") {
					return {
						title: "Users List",
						componentName: "user-list",
						attributes: "{(session)}='../session'",
						moduleName: "user/list/"
					};

				} else if(page === "register" || page === "account") {
					return {
						title: "Account",
						componentName: "user-details",
						attributes: "{(session)}='../session'",
						moduleName: "user/details/"
					};

				} else if(page === "players"){
					return {
						title: "Players",
						componentName: "player-list",
						attributes: "{is-admin}='../isAdmin'",
						moduleName: "player/list/"
					};

				} else {
					return {
						title: "Page Not Found",
						componentName: "four-0-four",
						attributes: "",
						moduleName: "404.component!",
						statusCode: 404
					};
				}
			}
		},
		/**
		* @property {bitballs/models/session} bitballs/app.session session
		* @parent bitballs/app.properties
		* The session if one exists.
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
		tournamentId: {type: "number"},
		/**
		* @property {Number} bitballs/app.statusCode statusCode
		* @parent bitballs/app.properties
		* The status code used for server-side rendering.
		**/
		statusCode: {
			get: function(){
				var pageConfig = this.attr("pageComponentConfig");

				if(pageConfig.statusCode) {
					return pageConfig.statusCode;
				}

				var pagePromise = this.attr('pagePromise');
				if(pagePromise){
					// pagePromise is guaranteed to be resolved here
					// because done-ssr will not call the statusCode
					// getter until the app is done loading
					return pagePromise.state()==="rejected" ? 404 : 200;
				}else{
					return 200;
				}
			}
		},
		pagePromise: {
			value: undefined,
			serialize: false
		}
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
