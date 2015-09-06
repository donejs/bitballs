var Component = require("can/component/component");
var ViewModel = require("./viewModel")

require("bootstrap/dist/css/bootstrap.css!");
require("can/route/");
require("can/view/href/");

Component.extend({
	tag: "tournament-details",
	template: require("./details.stache!"),
	viewModel: ViewModel,
	helpers: {
		playerById: function(id, options){
			var idVal = id();
			if(idVal != null) {
				return options.fn( this.attr("playerIdMap")[idVal] );
			} else {
				return;
			}

		},
		teamById: function(id, options){
			var idVal = id();
			if(idVal != null) {
				return options.fn( this.attr("teamIdMap")[idVal] );
			} else {
				return;
			}

		}
	}
});
// promisee