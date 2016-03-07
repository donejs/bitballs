var app = require("../app");
var passport = require('passport');
var User = require("../models/user");
var _ = require("lodash");
var bCrypt = require("bcrypt-nodejs");
var LocalStrategy = require('passport-local').Strategy;
var adminOnly = require( "../adminOnly" );
var nodeMail = require( "./email" );

app.get('/services/users', adminOnly(), function( req, res ) {
	User.collection().query(function(qb){
		qb.orderBy('email','ASC'); 
	}).fetch().then(function( users ){
		users = _.map( users.toJSON(), function( user ) {
			return _.omit( user, [ "password", "verificationHash" ] );
		});
		res.send({data: users});
	});
});

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

					var passHash = createHash( password );
					var hashHash = createHash( passHash );
					var newUser = new User({
						email: username,
						password: passHash,
						verified: false,
						verificationHash: hashHash,
						isAdmin: !numberOfUsers
					});
					// set the user's local credentials

					console.log( "Hashy hash:", hashHash );
		
					// save the user
					newUser.save().then(function(err) {
						console.log('User Registration step 1 succesful');
						return done(null, newUser);
					}, function(err) {
						console.log('Error in Saving user: ' + err);
					});
				});
			}
		});
	});
}));

app.post('/services/users', 
	function(req, res, next){
		if(!req.body.password){
			res.status(404).send({type: "Bad Request", message: "Password is required"});
		}else{
			next();
		}
	},
	passport.authenticate('signup'), 
	function( req, res ) {
		var user = req.user.toJSON();
		var subject = "Complete your registration at bitballs";
		var htmlbody = "To complete your registration, copy this hash into the form:<br>" + user.verificationHash;

		nodeMail( user.email, 'signup@bitballs.com', subject, htmlbody, function ( err, info ) {
			if ( err ) {
				throw err;
			}
			res.send( _.omit( user, [ "password", "verificationHash" ] ) );
		});
	}
);

var createHash = function(password) {
	return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
};
var isValidPassword = function(user, password) {
	return bCrypt.compareSync(password, user.password);
}; 
