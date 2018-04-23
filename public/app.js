/**
 * @module {can-map} bitballs/app AppViewModel
 * @parent bitballs
 *
 * @group bitballs/app.properties 0 properties
 */
import DefineMap from "can-define/map/map";
import "bootstrap/dist/css/bootstrap.css!";
import route from 'can-route';
import Session from './models/session';
import "can-route-pushstate";
import stache from "can-stache";
import 'can-stache-route-helpers';
import "./util/prefilter";
import can from "can-namespace";

if(typeof window !== "undefined") {
	window.can = can; // This is just for debugging.
}

const AppViewModel = DefineMap.extend('App',
{
	env: {
		default: () => ({NODE_ENV:'development'}),
		set: function(newVal){
			console.log("ENV IS SET TO ", newVal);
			return newVal;
		},
		serialize: false
  	},
	/**
	* @property {String} bitballs/app.title title
	* @parent bitballs/app.properties
	* The app title based on current page
	**/
	get title(){
		return "BitBalls | " + this.pageComponentConfig.title;
	},
	/**
	* @property {String} bitballs/app.page page
	* @parent bitballs/app.properties
	* Current page
	**/
	page: 'string',
	/**
	* @property {Number} bitballs/app.gameId gameId
	* @parent bitballs/app.properties
	* Current GameID
	**/
	gameId: 'number',
	/**
	* @property {Number} bitballs/app.tournamentId tournamentId
	* @parent bitballs/app.properties
	* Current tournament id
	**/
	tournamentId: 'number',
	/**
	* @property {Number} bitballs/app.playerId playerId
	* @parent bitballs/app.properties
	* Current player id
	**/
	playerId: 'number',
	/**
	* @property {Promise} bitballs/app.pagePromise pagePromise
	* @parent bitballs/app.properties
	* Promise object
	**/
	pagePromise: {
		default: undefined,
		serialize: false
	},
	/**
	* @property {object} bitballs/app.pageComponentConfig pageComponentConfig
	* @parent bitballs/app.properties
	* page specific config object
	**/
	get pageComponentConfig() {
		var page = this.page;
		if(this.gameId) {
			return {
				title: "Game",
				componentName: "game-details",
				attributes: "gameId:from='./gameId'  session:from='./session' gamePromise:to='./pagePromise'",
				moduleName: "game/details/"
			};

		} else if(this.tournamentId) {
			return {
				title: "Tournament",
				componentName: "tournament-details",
				attributes: "tournamentId:from='./tournamentId' isAdmin:from='./isAdmin' tournamentPromise:to='./pagePromise'",
				moduleName: "tournament/details/"
			};

		} else if(this.playerId) {
			return {
				title: "Player",
				componentName: "player-details",
				attributes: "playerId:from='./playerId' playerPromise:to='./pagePromise'",
				moduleName: "player/details/"
			};

		} else if(page === "tournaments") {
			return {
				title: "Tournaments",
				componentName: "tournament-list",
				attributes: "isAdmin:from='./isAdmin'",
				moduleName: "tournament/list/"
			};

		} else if(page === "users") {
			return {
				title: "Users List",
				componentName: "user-list",
				attributes: "session:from='./session'",
				moduleName: "user/list/"
			};

		} else if(page === "register" || page === "account") {
			return {
				title: "Account",
				componentName: "user-details",
				attributes: "session:bind='./session'",
				moduleName: "user/details/"
			};

		} else if(page === "players"){
			return {
				title: "Players",
				componentName: "player-list",
				attributes: "isAdmin:from='./isAdmin'",
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
	},
	/**
	* @property {bitballs/models/session} bitballs/app.session session
	* @parent bitballs/app.properties
	* The session if one exists.
	**/
	session: {
		serialize: false,
		default: function() {
			var self = this;
			Session.get({})
				.then(function(session){
					self.session = session;
				}, function() {
					self.session = null;
				});
		}
	},
	/**
	* @property {Number} bitballs/app.statusCode statusCode
	* @parent bitballs/app.properties
	* The status code used for server-side rendering.
	**/
	statusCode: {
		get: function(lastSet, resolve) {
			var pageConfig = this.pageComponentConfig;

			if(pageConfig.statusCode) {
				return pageConfig.statusCode;
			}

			var pagePromise = this.pagePromise;
			if(pagePromise){
				// pagePromise is guaranteed to be resolved here
				// because done-ssr will not call the statusCode
				// getter until the app is done loading
				return pagePromise.then(function(){
					resolve(200);
				}, function(){
					resolve(404);
				});
			}else{
				return 200;
			}
		}
	},
	/**
	 * @property {Boolean} bitballs/app.isAdmin isAdmin
   *
   * Whether the logged in user has an admin role.
	 */
  isAdmin: {
    get: function get() {
      var session = this.session;

      if (session && session.user) {
        return session.user.isAdmin;
      } else {
        return false;
      }
    }
  }
});

stache.registerHelper("pageComponent", function(scope, options){
	var pageComponent = options.context.pageComponentConfig,
		helpers = scope.templateContext.helpers,
		template =
			"<can-import from='bitballs/components/" + pageComponent.moduleName + "'>" +
				"{{#if isResolved}}" +
					"{{#with scope.root}}<"+pageComponent.componentName + " " + pageComponent.attributes + "/>{{/with}}" +
				"{{else}}" +
					"Loading..." +
				"{{/if}}" +
			"</can-import>";
	return stache(template)(scope, options.nodeList);
});

route.register('tournaments/{tournamentId}');
route.register('games/{gameId}');
route.register('players/{playerId}');
route.register('{page}',{page: 'tournaments'});

export default AppViewModel;
