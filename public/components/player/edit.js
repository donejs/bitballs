var Component = require("can/component/component");

require("bootstrap/dist/css/bootstrap.css!");
require("can/map/define/");
var Player = require("bitballs/models/player");

Component.extend({
	tag: "player-edit",
	template: require("./edit.stache!"),
	viewModel: {
		define: {
			player: {
				Value: Player
			}
		},
		savePlayer: function(ev, el){
			ev.preventDefault();
			var self = this;
			var player = this.attr("player");
			if(player.isNew()) {
				player.save().then(function(){
					self.attr("player",new Player());
				}).then(function(){
					el.parent().triggerHandler("saved");
				});
			} else {
				player.save().then(function(){
					el.parent().triggerHandler("saved");
				});
			}
		},
		cancelEvent: function(el) {
			el.closest("player-edit").triggerHandler("canceled");
		}
	}
});


// promise