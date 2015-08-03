var Component = require("can/component/component");

require("bootstrap/dist/css/bootstrap.css!");
require("can/map/define/");
var Player = require("bitballs/models/player");

Component.extend({
	tag: "player-create",
	template: require("./create.stache!"),
	viewModel: {
		define: {
			playerId: {
				type: "number",
				set: function(newValue){
					if(newValue != null && newValue != this.attr("player.id")) {
						can.batch.start();
						var self = this;
						this.removeAttr("player");
						var promise = Player.get({id: newValue})
						this.attr("playerPromise", promise );
						promise.then(function(player){
								self.attr("player", player);
							});
						can.batch.stop();
					} else if(newValue == null && this.attr("player.id") != null) {
						this.attr("player", new Player() );
					}
					return newValue;
				}
			},
			player: {
				Value: Player
			}
		},
		savePlayer: function(ev){
			ev.preventDefault();
			var self = this;
			this.attr("player").save().then(function(player){
				self.attr("playerId", player.attr("id"));
			});
		}
	}
});


// promise