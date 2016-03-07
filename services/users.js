var app = require("../services/app");
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

passport.use('basic', new LocalStrategy({
	usernameField: 'email',
	passReqToCallback : true
}, function(req, username, password, done){
	new User({
		'email': username
	}).fetch().then(function(user) {
		if(isValidPassword(user.attributes, password)){
			return done(null, user);
		}else {
			return done(null, false);
		}
	})
}));

app.post('/services/users',
	function(req, res, next){
		new User({
			email: req.body.email,
			password: req.body.password
		}).validateSave().then(function(){
			next();
		}, function(e){
			res.status(500).send(e);
		});
	},
	passport.authenticate('signup'), 
	function(req, res) {
		res.send(_.omit(req.user.toJSON(), "password"));
	});

app.put('/services/users/:id',
	function(req, res, next){
		new User({
			email: req.body.email,
			password: req.body.newPassword
		}).validateSave().then(function(){
			passport.authenticate('basic', function(err, user, info){
				if (err) { return next(err); }
				if(!user) { return res.status(401).send({password: "Incorrect Password"}); }

				new User({id: req.params.id}).save({
					email: user.attributes.email,
					password: createHash(req.body.newPassword)
				}).then(function(user){
					res.send(_.omit(req.user.toJSON(), "password"));
				});
			})(req, res, next);
		}).catch(function(e){
			res.status(400).send(e);
		});
	});

var createHash = function(password) {
	return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
};
var isValidPassword = function(user, password) {
	return bCrypt.compareSync(password, user.password);
}; 
