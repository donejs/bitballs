var Component = require("can/component/component");

require("bootstrap/dist/css/bootstrap.css!");
require("can/map/define/");
require("can/route/");
require("can/view/href/");

var vm = require("./view-model");

Component.extend({
	tag: "user-create",
	template: require("./create.stache!"),
	viewModel: vm
});


// promise