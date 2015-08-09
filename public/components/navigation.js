var Component = require("can/component/component");

require("bootstrap/dist/css/bootstrap.css!");
require("can/route/");
require("can/view/href/");

var stache = require("can/view/stache/");
var route = require("can/route/");
stache.registerHelper("isActive", function(options){
	var attrs = {};
	for(var prop in options.hash) {
		var value = options.hash[prop];
		if(typeof value === "function" && value.isComputed) {
			value = value();
		}
		attrs[prop] = value;
	}
	return route.current(attrs) ? options.fn() : options.inverse();
});

can.Component.extend({
	tag: "bitballs-navigation",
	template: require("./navigation.stache!"),
	viewModel: {
		
	}
});
