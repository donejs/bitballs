import AppMap from "can-ssr/app-map";
import Player from "./models/player";
import "can/map/define/";
import "bootstrap/dist/css/bootstrap.css!";

const AppState = AppMap.extend({
  message: 'Hello World!',
  title: 'bitballs-client',
  define: {
  	players: {
  		value: function(){
  			return Player.getList({});
  		}
  	}
  }
});

export default AppState;
