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
					return "game-details game-id='{gameId}' session='{session}'";

				} else if(this.attr("teamId")) {
					return "team-details session='{.}'";

				} else if(this.attr("tournamentId")) {
					return "tournament-details tournament-id='{tournamentId}' session='{session}'";

				} else if(this.attr("page") === "tournaments") {
					return "tournament-list app-state='{.}'";

				} else if(this.attr("page") === "register") {
					return "user-create session='{session}'";

				} else if( this.attr("gameId") ) {
					return "game-details session='{.}'";

				} else {
					return "player-list session='{session}'";
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
		return can.stache("<"+this.attr("pageComponentName")+"/>")(this);
	},
	isAdmin: function(){
		var session = this.attr("session");
		return session && session.attr("user").attr("isAdmin");
	}

});

route(':page',{page: 'tournaments'});

export default AppState;
