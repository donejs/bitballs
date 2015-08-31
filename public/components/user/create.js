var Component = require("can/component/component");

require("bootstrap/dist/css/bootstrap.css!");
require("can/map/define/");
require("can/route/");
require("can/view/href/");

var User = require("bitballs/models/user");

Component.extend({
	tag: "user-create",
	template: require("./create.stache!"),
	viewModel: {
		define: {
			user: {
				Value: User
			}
		},
		createUser: function(ev){
			ev.preventDefault();
			var self = this;
			this.attr("user").save().then(function(user){
				
				// new Session({user: user})
				
			});
		}
	}
});


// promise