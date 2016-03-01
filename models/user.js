var bookshelf = require("../bookshelf");
var Checkit = require("checkit");
var LocalStrategy = require('passport-local').Strategy;
var passport = require('passport');
var bCrypt = require("bcrypt-nodejs");
var _ = require("lodash");


passport.use('signup', new LocalStrategy({
	passReqToCallback : true,
	usernameField : 'email'
}, function(req, username, password, done) {
	process.nextTick(function() {
		new User({
			'email' : username
		}).fetch().then(function(user) {
			if(user) {
				console.log("POST USERS: use already exists" + username, user);
				done(null, false);
			} else {
				User.count().then( function ( numberOfUsers ) {
					//bookshelf returns a string for the result of a count.
					numberOfUsers = parseInt( numberOfUsers, 10 ) || 0;
					console.log( "POST USERS: creating a new user. Current count of users:", numberOfUsers );
					var newUser = new User({
						email: username,
						password: createHash(password),
						isAdmin: !numberOfUsers
					});
					// set the user's local credentials
		
					// save the user
					newUser.save().then(function(err) {
						console.log('User Registration succesful');
						return done(null, newUser);
					}, function(err) {
						console.log('Error in Saving user: ' + err);
					});
				});
			}
		});

	});

}));

var User = bookshelf.Model.extend({
	tableName: 'users',
	initialize: function(){
		this.on('saving', this.validateSave);
	},
	validateSave: function(){
		return new Checkit({
			email: ['required', 'email'],
			password: 'required'
		}).run(this.attributes).then(passport.authenticate('signup'));
	}
});

var createHash = function(password) {
	return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
};
var isValidPassword = function(user, password) {
	return bCrypt.compareSync(password, user.password);
}; 

module.exports = User;