var Component = require("can/component/component");

require("bootstrap/dist/css/bootstrap.css!");
require("can/route/");
require("can/view/href/");

can.Component.extend({
	tag: "bitballs-navigation",
	template: require("./navigation.stache!")
});
