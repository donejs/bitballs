var Component = require("can/component/component");

require("bootstrap/dist/css/bootstrap.css!");
require("can/map/define/");
require("can/route/");
require("can/view/href/");

var Player = require("bitballs/models/player");

Component.extend({
	tag: "player-list",
	template: require("./list.stache!"),
	viewModel: {
		define: {
			players: {
				value: function(){
					return Player.getList({});
				}
			}
		},
		editPlayer: function(player){
			this.attr("editingPlayer", player);
		},
		removeEdit: function(){
			this.removeAttr("editingPlayer");
		}
	}
});


// promise