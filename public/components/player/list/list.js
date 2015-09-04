var Component = require("can/component/component");
var template = require("./list.stache!");

require("bootstrap/dist/css/bootstrap.css!");
require("can/map/define/");
require("can/route/");
require("can/view/href/");

var Player = require("bitballs/models/player");

var ViewModel = exports.ViewModel = can.Map.extend({
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
});

exports.Component = Component.extend({
	tag: "player-list",
	template: template,
	viewModel: ViewModel
});
