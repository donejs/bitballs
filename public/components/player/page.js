var Component = require("can/component/component");

require("bootstrap/dist/css/bootstrap.css!");
require("can/map/define/");
require("can/route/");
require("can/view/href/");
require("./edit.js");
require("./list.js");

var Player = require("bitballs/models/player");

Component.extend({
	tag: "player-page",
	template: require("./page.stache!"),
	viewModel: {
		define: {
			
		},
		showList: function(){
			return !this.attr("route.playerId") && this.attr("route.page") === "player";
		},
		showEdit: function(){
			return this.attr("route.playerId") || this.attr("route.page") === "new-player";
		}
		
	}
});


// promise