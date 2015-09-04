require("can/map/define/");
var User = require("bitballs/models/user");
var Session = require("bitballs/models/session");

module.exports = can.Map.extend({
	define: {
		user: {
			Value: User
		},
		session: {
			Type: Session
		}
	},
	createUserHandler: function(ev){
		ev.preventDefault();
		this.createUser();
	},
	createUser: function(){
		var self = this;
		return this.attr("user").save().then(function(user){

			// Clear password:
			user.attr("password", "");

			if (!self.attr("session")){
				// Create session:
				self.attr("session", new Session({user: user}));

			} else {
				// Update session:
				self.attr("session").attr({user: user});
			}
		});
	}
});