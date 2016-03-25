var can = require("can");

can.Component.extend({
	tag: "home-page",
	template: require("./home.stache!"),
	viewModel: {
		showThing: false
	},
	events: {
		init: function(){
			var vm = this.viewModel;
			setTimeout(function(){
				vm.attr("showThing", true);
			}, 50);
		}
	}
});
