import AppMap from "can-ssr/app-map";
import Player from "./models/player";
import "can/map/define/";
import "bootstrap/dist/css/bootstrap.css!";
import route from 'can/route/';
import Session from './models/session';

const AppState = AppMap.extend({
	define: {
		pageComponentName: {
			get: function(){
				if(this.attr("gameId")) {
					return "game-details";
				} else if(this.attr("teamId")) {
					return "team-details";
				} else if(this.attr("tournamentId")) {
					return "tournament-details";
				} else if(this.attr("page") === "tournaments") {
					return "tournament-list";
				} else if(this.attr("page") === "user") {
					return "user-create";
				} else if( this.attr("gameId") ) {
					return "game-details";
				} else {
					return "player-list";
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
	pageComponent: function(){
  		return can.stache("<"+this.attr("pageComponentName")+" app-state='{app}' session='{app.session}' />")({
  			app: this
  		});
	},
	isAdmin: function(){
		var session = this.attr("session");
		return session && session.attr("user").attr("isAdmin");
	}
	
});

route(':page',{page: 'tournaments'});

export default AppState;
