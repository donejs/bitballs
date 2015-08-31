var app = require("../app");
var passport = require('passport');
var User = require("../models/user");
var _ = require("lodash");
var bCrypt = require("bcrypt-nodejs");
var LocalStrategy = require('passport-local').Strategy;


passport.use('signup', new LocalStrategy({
	passReqToCallback : true,
	usernameField : 'email'
}, function(req, username, password, done) {
	process.nextTick(function() {
		// find a user in Mongo with provided username
		new User({
			'email' : username
		}).fetch().then(function(user) {
			if(user) {
				console.log("POST USERS: use already exists" + username, user);
				done(null, false);
			} else {
				console.log("POST USERS: creating a new user");
				var newUser = new User({
					email: username,
					password: createHash(password),
					isAdmin: username === "justin@bitovi.com" || username === "justinbmeyer@gmail.com"
				});
				// set the user's local credentials
	
				// save the user
				newUser.save().then(function(err) {
					console.log('User Registration succesful');
					return done(null, newUser);
				}, function(err) {
					console.log('Error in Saving user: ' + err);
				});
			}
			
			
			

		}, function() {
			
		});

	});

}));

app.post('/services/users', passport.authenticate('signup'), function(req, res) {

	res.send(_.omit(req.user.toJSON(), "password"));
});

var createHash = function(password) {
	return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
};
var isValidPassword = function(user, password) {
	return bCrypt.compareSync(password, user.password);
}; 