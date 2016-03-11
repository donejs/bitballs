import Map from "can/map/";
import Player from "./models/player";
import "can/map/define/";
import "bootstrap/dist/css/bootstrap.css!";
import route from 'can/route/';
import Session from './models/session';
import "can/route/pushstate/";
import stache from "can/view/stache/";
import "./prefilter";

const AppState = Map.extend({
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
						attributes: "game-id='{gameId}' session='{session}'",
						moduleName: "game/details/"
					};
				} else if(this.attr("tournamentId")) {
					return {
						title: "Tournament",
						componentName: "tournament-details",
						attributes: "{tournament-id}='tournamentId' {session}='session'",
						moduleName: "tournament/details/"
					};
				} else if(this.attr("page") === "tournaments") {
					return {
						title: "Tournaments",
						componentName: "tournament-list",
						attributes: "{app-state}='../.'",
						moduleName: "tournament/list"
					};


				} else if(this.attr("page") === "register"  || this.attr("page") === "account") {
					return {
						title: "Account",
						componentName: "user-create",
						attributes: "session='{session}'",
						moduleName: "user/create"
					};
				} else if( this.attr("gameId") ) {
					return {
						title: "Game",
						componentName: "game-details",
						attributes: "{session}='../.'",
						moduleName: "game/details/"
					};

				} else {
					return {
						title: "Players",
						componentName: "player-list",
						attributes: "session='{session}'",
						moduleName: "player/list/"
					};

				}
			}
		},
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

	return can.stache(template)(this, options.helpers, options.nodeList);
});

route(':page',{page: 'tournaments'});

export default AppState;
