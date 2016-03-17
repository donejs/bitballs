var Component = require("can/component/component");
var CanMap = require("can/map/");
var Tournament = require("bitballs/models/tournament");

require("bootstrap/dist/css/bootstrap.css!");
require("can/map/define/");
require("can/route/");
require("can/view/href/");

exports.ViewModel = CanMap.extend({
	define: {
		tournament: {
			Type: Tournament,
			Value: Tournament
		}
	},
	createTournament: function(ev) {
		if (ev) {
			ev.preventDefault();
		}
		var self = this;

		var promise = this.attr("tournament").save().then(function(player) {
			self.attr("tournament", new Tournament());
		});

		this.attr("savePromise", promise);

		return promise;
	}
});

exports.Component = Component.extend({
	tag: "tournament-list",
	template: require("./list.stache!"),
	viewModel: exports.ViewModel,
	leakScope: false
});
