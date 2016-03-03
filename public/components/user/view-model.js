require("can/map/define/");
var User = require("bitballs/models/user");
var Session = require("bitballs/models/session");

module.exports = can.Map.extend({
	define: {
		user: {
			/**
			 * user is used to bind to the form, so it must always be instanceof User
			 */
			Value: User,

			/**
			 * Sync user with session.user if session is active
			 */
			get: function(val){
				if (this.attr('session.user')){
					//console.log('- existing user. Session: ' + this.attr('session').attr());
					return this.attr('session.user');
				}
				//console.log('- NEW user.');
				return val;
			}
		},
		session: {
			value: null
		}
	},
	createUserHandler: function(ev){
		ev.preventDefault();
		this.saveUser();
	},
	saveUser: function(){
		var self = this;
		var promise = this.attr("user").save().then(function(user){

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

		this.attr('savePromise', promise);

		return promise;
	}
});