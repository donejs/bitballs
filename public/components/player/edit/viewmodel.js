var can = require("can");
require("can/map/define/");
var Player = require("bitballs/models/player");


module.exports = can.Map.extend({
	define: {
		player: {
			Value: Player,
			Type: Player
		}
	},
	savePlayer: function(){
		var self = this;
		var player = this.attr("player"),
			promise;

		if(player.isNew()) {
			promise = player.save().then(function(){
				self.attr("player",new Player());
			}).then(function(){
				can.dispatch.call(self, "saved");
			});
		} else {
			promise = player.save().then(function(){
				can.dispatch.call(self, "saved");
			});
		}

		this.attr('savePromise', promise);

		return promise;
	},
	cancelEvent: function() {
		can.dispatch.call(this, "canceled");
	}
});