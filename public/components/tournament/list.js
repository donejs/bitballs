var Component = require("can/component/component");

require("bootstrap/dist/css/bootstrap.css!");
require("can/map/define/");
require("can/route/");
require("can/view/href/");

var Tournament = require("bitballs/models/tournament");

Component.extend({
	tag: "tournament-list",
	template: require("./list.stache!"),
	viewModel: {
		define: {
			tournament: {
				Value: Tournament
			}
		},
		createTournament: function(ev){
			ev.preventDefault();
			var self = this;
			this.attr("tournament").save().then(function(player){
				self.attr("tournament", new Tournament());
			});
		}
	}
});


// promise