var Component = require("can/component/component"),
	viewmodel = require("./viewmodel");

require("bootstrap/dist/css/bootstrap.css!");
require("can/map/define/");
require("can/route/");
require("can/view/href/");

var Tournament = require("bitballs/models/tournament/");

Component.extend({
	tag: "tournament-list",
	template: require("./list.stache!"),
	viewModel: viewmodel
});


// promise