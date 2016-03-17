var Component = require("can/component/");
var template = require("./list.stache!");
var CanMap = require("can/map/");

require("bootstrap/dist/css/bootstrap.css!");
require("can/map/define/");
require("can/route/");
require("can/view/href/");

var Player = require("bitballs/models/player");

var ViewModel = exports.ViewModel = CanMap.extend({
	define: {
		players: {
			value: function(){
				return Player.getList({orderBy: "name"});
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
