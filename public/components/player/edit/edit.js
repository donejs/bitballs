/**
 * @module {Module} bitballs/components/player/edit <player-edit>
 * @parent bitballs.components
 **/
var Component = require("can/component/component");
var Player = require("bitballs/models/player");
var CanMap = require("can/map/");

require("bootstrap/dist/css/bootstrap.css!");
require("can/map/define/");
require('can/map/backup/');
require("can/construct/super/");


exports.ViewModel = CanMap.extend({
	define: {
		isAdmin: {
			type: 'boolean',
			value: false
		},
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
			});
		} else {
			promise = player.save();
		}

		promise.then(function(){
			player.backup();
			self.dispatch("saved");
		});

		this.attr('savePromise', promise);

		return promise;
	},
	cancel: function() {
		this.attr('player').restore();
		this.dispatch("canceled");
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
	})
});
