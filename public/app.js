/**
 * @module {can-map} bitballs/app AppViewModel
 * @parent bitballs
 *
 * @group bitballs/app.properties 0 properties
 */
import { DefineMap, route, value } from "can";
import "bootstrap/dist/css/bootstrap.css!";
import Session from './models/session';
import RoutePushstate from "can-route-pushstate";
import "can-stache-route-helpers";
import "./util/prefilter";
import debug from 'can-debug#?is-dev';

//!steal-remove-start
if(debug) {
	debug();
}
//!steal-remove-end

const AppViewModel = DefineMap.extend('App',
{
  init() {
    this.bind('statId', () => {
      can.queues.logStack();
    });
  },
	env: {
		default: () => ({NODE_ENV:'development'}),
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
	 * @property {Number} bitballs/app.statId statId
	 * @parent bitballs/app.properties
	 * Current StatID
	 **/
	statId: 'number',
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
      console.log('gameId', this.gameId,
                  'statId', this.statId);
			return {
				title: "Game",
				componentName: "game-details",
				viewModel: () => ({
					gameId: value.from(this, "gameId"),
					session: value.from(this, "session"),
					gamePromise: value.to(this, "pagePromise"),
					statId: value.to(this, "statId"),
				}),
				moduleName: "game/details/"
			};

		} else if(this.tournamentId) {
			return {
				title: "Tournament",
				componentName: "tournament-details",
				viewModel: () => ({
					tournamentId: value.from(this, "tournamentId"),
					isAdmin: value.from(this, "isAdmin"),
					tournamentPromise: value.to(this, "pagePromise")
				}),
				moduleName: "tournament/details/"
			};

		} else if(this.playerId) {
			return {
				title: "Player",
				componentName: "player-details",
				viewModel: () => ({
					playerId: value.from(this, "playerId"),
					playerPromise: value.to(this, "pagePromise")
				}),
				moduleName: "player/details/"
			};

		} else if(page === "tournaments") {
			return {
				title: "Tournaments",
				componentName: "tournament-list",
				viewModel: () => ({
					isAdmin: value.from(this, "isAdmin")
				}),
				moduleName: "tournament/list/"
			};

		} else if(page === "users") {
			return {
				title: "Users List",
				componentName: "user-list",
				viewModel: () => ({
					session: value.from(this, "session")
				}),
				moduleName: "user/list/"
			};

		} else if(page === "register" || page === "account") {
			return {
				title: "Account",
				componentName: "user-details",
				viewModel: () => ({
					session: value.bind(this, "session")
				}),
				moduleName: "user/details/"
			};

		} else if(page === "players"){
			return {
				title: "Players",
				componentName: "player-list",
				viewModel: () => ({
					isAdmin: value.from(this, "isAdmin")
				}),
				moduleName: "player/list/"
			};

		} else {
			return {
				title: "Page Not Found",
				componentName: "four-0-four",
				viewModel: () => ({}),
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
  },

	get pageComponent() {
		var moduleName = "bitballs/components/" + this.pageComponentConfig.moduleName;
		return steal.import(moduleName).then(({Component}) => {
			return new Component({ viewModel: this.pageComponentConfig.viewModel() });
		});
	}
});

// can.queues.log('flush');
route.urlData = new RoutePushstate();
route.register('tournaments/{tournamentId}');
route.register('games/{gameId}/{statId}');
route.register('games/{gameId}');
route.register('players/{playerId}');
route.register('{page}',{page: 'tournaments'});

export default AppViewModel;
