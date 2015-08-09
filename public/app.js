import AppMap from "can-ssr/app-map";
import Player from "./models/player";
import "can/map/define/";
import "bootstrap/dist/css/bootstrap.css!";
import route from 'can/route/';
import 'can/route/pushstate/';

const AppState = AppMap.extend({
	define: {
		pageComponentName: {
			get: function(){
				if(this.attr("gameId")) {
					return "game-details"
				} else if(this.attr("teamId")) {
					return "team-details";
				} else if(this.attr("tournamentId")) {
					return "tournament-details";
				} else if(this.attr("page") === "tournaments") {
					return "tournament-list";
				} else if( this.attr("gameId") ) {
					return "game-details";
				} else {
					return "player-list";
				}
			}
		},
		user: {
			value: function(){
				return new can.Map({
					isAdmin: true
				});
			},
			serialize: false
		},
		tournamentId: {type: "number"}
	},
	
	pageComponent: function(){
  		return can.stache("<"+this.attr("pageComponentName")+" app-state='{app}'/>")({
  			app: this
  		});
  	}
	
});

route(':page',{page: 'tournaments'});

export default AppState;
