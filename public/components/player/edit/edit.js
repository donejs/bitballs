var Component = require("can/component/component");

require("bootstrap/dist/css/bootstrap.css!");
require("can/map/define/");
require("can/construct/super/");

var viewModel = require("bitballs/components/player/edit/viewmodel");

module.exports = Component.extend({
	tag: "player-edit",
	template: require("./edit.stache!"),
	viewModel: viewModel.extend({
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

// promise