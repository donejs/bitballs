var Map = require("can/map/map");
var Component = require("can/component/component");
var template = require("./fake-navigation.stache!");

can.Component.extend({
	tag: "fake-navigation",
	template: template,
	viewModel: {
		createSession: function(ev){
			this.attr("session", {
				user: {
					isAdmin: true
				}
			});
		},
		logout: function(ev){
			this.attr("session", false);
		}
	}
});
