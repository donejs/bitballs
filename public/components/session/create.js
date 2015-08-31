var Component = require("can/component/component");

require("bootstrap/dist/css/bootstrap.css!");
require("can/map/define/");
require("can/route/");
require("can/view/href/");

var Session = require("bitballs/models/session");

Component.extend({
	tag: "session-create",
	template: require("./create.stache!"),
	viewModel: {
		define: {
			user: {
				Value: Session
			}
		},
		createSession: function(ev){
			ev.preventDefault();
			var self = this;
			this.attr("session").save().then(function(session){
				
				// new Session({user: user})
				
			});
		}
	}
});


// promise