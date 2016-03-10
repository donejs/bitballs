var Component = require("can/component/component");
require("bootstrap/dist/css/bootstrap.css!");
require("can/map/define/");
require("can/construct/super/");
var Player = require("bitballs/models/player");

exports.ViewModel = can.Map.extend({
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
				self.attr("player", new Player());
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

exports.Component = Component.extend({
	tag: "player-edit",
	template: require("./edit.stache!"),
	viewModel: exports.ViewModel.extend({
		savePlayer: function(ev) {
			ev.preventDefault();
			this._super.apply(this,arguments);
		}
	}),
	events: {
		"{viewModel} saved": function(vm, ev, arg1){
			this.element.triggerHandler("saved", arg1);
		},
		"{viewModel} canceled": function(vm, ev, arg1){
			this.element.triggerHandler("canceled", arg1);
		}
	}
}); 
