var app = require("../services/app");
var passport = require('passport');
var User = require("../models/user");
var _ = require("lodash");
var bCrypt = require("bcrypt-nodejs");
var LocalStrategy = require('passport-local').Strategy;
var adminOnly = require( "./adminOnly" );
var nodeMail = require( "./email" );
var urls = require("../package.json").urls;
var envKey = process.env.NODE_ENV === 'production' ? 'prod' : 'dev';
var appUrl = urls[envKey];
/**
 * @module {function} services/users /services/users
 * @parent bitballs.services
 *
 * @signature `GET /services/users`
 *   Gets users from the database.
 *
 * 		GET /services/users?
 * 			where[idAdmin]=true&
 * 			sortBy=email
 *
 *	@param {Object} [where] Clause to filter which users are returned
 *	@param {String} [sortBy] Clause used to sort the returnd users
 *	@return {JSON} An object that contains the user data, omitting sensitive information:
 *
 * 		{data: [{
 * 			"id": Int,
 * 			"name": String,  	// Optional name
 * 			"email": String,	// User email address
 * 			"isAdmin": Boolean,	// Whether user is an admin
 * 			"verified": Boolean // Whether user has verified an email address
 * 		}, ...]}
 *
 *  @signature 'POST /services/users'
 *    Creates a user in the database and sends a verification email to the provided email address.
 *
 * 		POST /services/users
 * 		 {
 * 		   "name": "Atticus Finch",
 * 		   "email": "addyfizzle@publicdefenders.org"
 * 		   "password": "H3HLJ2HIO4",					//hashed password
 * 		 }
 *
 *     @param {JSON} JSONBody The raw JSON properties of a user object
 *     @return {JSON} Returns JSON with the properties of the newly created object, including its id but omitting sensitive data.
 *
 * 		{
 * 		  "id": 9,
 * 	 	  "name": "Atticus Finch",
 * 	 	  "email": "addyfizzle@publicdefenders.org",
 * 	 	  "isAdmin": false,
 * 	 	  "verified": false
 * 		}
 *
 *  @signature `GET /services/users/:id`
 *     Gets a user by id from the database
 *
 * 			GET /services/users/9
 *
 *   @return {JSON} Object that contains the player data, omitting sensitive information
 *
 * 		{
 * 		  "id": Int,
 * 		  "name": String,  	// Optional name
 * 		  "email": String,	// User email address
 * 		  "isAdmin": Boolean,	// Whether user is an admin
 * 		  "verified": Boolean // Whether user has verified an email address
 * 		}
 *
 *  @signature `PUT /services/users/:id`
 *    Updates a user in the database. Logged in users can update themselves, but only admins can update any user.
 *
 *      PUT /services/players/9
 *        {
 *          "email": "addyfizzle@publicdefenders.org"
 *          "verificationHash": "H3HLJ2HIO4H3HLJ2HIO4H3HLJ2HIO4"
 *        }
 *
 * 	  @param {JSON} JSONBody The updates properties of the user object.
 * 	  @return {JSON} Returns JSON with the properties of the updated user, omitting sensitive information
 *
 * 	      {
 * 		    "id": 9,
 * 	 	    "name": "Atticus Finch",
 * 	 	    "email": "addyfizzle@publicdefenders.org",
 * 	 	    "isAdmin": false,
 * 	 	    "verified": true
 * 	      }
 *
 * 	@signature `DELETE /services/users/9`
 * 	  Deletes a user in the database. Logged in users can delete themselves, but only admins can delete any user.
 *
 * 		DELETE /services/users/9
 *
 *    @return {JSON} Returns an empty JSON object.
 *
 * 		{}
 */

var omitSensitive = function ( user ) {
	if ( user.toJSON ) {
		user = user.toJSON();
	}
	return _.omit( user, [ "password", "verificationHash" ] );
};

var disallowAdminOnlyChanges = function ( onThis, withThis ) {
	var i, prop, forProps = [ "verified", "verificationHash", "isAdmin" ];
	for ( i = 0; i < forProps.length; i++ ) {
		prop = forProps[ i ];
		onThis[ prop ] = withThis[ prop ];
	}
};

app.get('/services/users', adminOnly(), function( req, res ) {
	User.collection().query(function(qb){
		qb.orderBy('email','ASC');
	}).fetch().then(function( users ){
		users = _.map( users.toJSON(), function( user ) {
			return omitSensitive( user );
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
					var hashHash = createHash( username + passHash );
					var newUser = new User({
						email: username,
						password: passHash,
						verified: false,
						verificationHash: hashHash,
						isAdmin: !numberOfUsers
					});

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
	function ( req, res, next ){
		// lets create a JS Representation of body-parsers JSON Body result
	        req.bodyJS = JSON.parse(req.body)
		if ( !req.bodyJS.password ) {
			res.status(404).send({ type: "Bad Request", message: "Password is required" });
		} else {
			next();
		}
	},
	passport.authenticate( 'signup' ),
	function ( req, res ) {
		var user = req.user.toJSON();
		var hash = encodeURIComponent( user.verificationHash );
		var subject = "Complete your registration at bitballs";
		var htmlbody = "Click here to verify your email address:<br>";
		htmlbody += "<a href='"+appUrl+"services/verifyemail/" + user.id + "/" + hash + "'>";
		htmlbody += "Verify Email Address";
		htmlbody += "</a>";

		nodeMail( user.email, 'bitballs@bitovi.com', subject, htmlbody, function ( err, info ) {
			if ( err ) {
				console.log("ERROR sending email", err);
				throw err;
			}
			res.send( omitSensitive( user ) );
		});
	}
);

app.get( "/services/verifyemail/:id/:verificationHash",
	function ( req, res ) {
		var userid = parseInt( req.params.id, 10 ) || 0;
		var verificationHash = req.params.verificationHash;

		new User({
			'id' : userid
		}).fetch().then( function( user ) {
			if ( !user ) {
				return res.status( 404 ).send({ err: "user (" + userid + ") not found" });
			}

			if ( user.get( "verified" ) ) {
				return res.status( 500 ).send({ err: "Already verified." });
			}

			if ( verificationHash === user.get( "verificationHash" ) ) {
				//update as email verified
				return user.save({ verified: true, verificationHash: "" }, { patch: true }).then( function ( user ) {
					res.redirect( "/account" );
				});
			} else {
				return res.status( 401 ).send({ err: "Verification hash is incorrect." });
			}
		}, function ( err ) {
			res.status( 500 ).send( err );
		});
	}
);

app.put( "/services/users/:id",
function ( req, res, next ) {
	var userid = parseInt( req.params.id, 10 ) || 0;
	if ( req.isAdmin ) {
		next();
	} else if ( req.user.attributes.id === userid ) {
		next();
	} else {
		res.status( 401 ).json({
			err: "Must be logged in to verify yourself."
		});
	}
},
function ( req, res ) {
	var userid = parseInt( req.params.id, 10 ) || 0;
	new User({
		'id' : userid
	}).fetch().then( function( user ) {
		if ( !user ) {
			return res.status( 404 ).send({ err: "user (" + userid + ") not found" });
		}

		if ( !req.isAdmin ) {
			disallowAdminOnlyChanges( req.body, user );
		}

		//Password updating
		if ( req.body.newPassword ) {
			if ( isValidPassword( user, req.body.password ) ) {
				return user.save({ password: createHash( req.body.newPassword ) }, { patch: true }).then( function ( user ) {
					res.send( omitSensitive( user ) );
				});
			} else {
				return res.status( 401 ).send({ err: "Password is incorrect" });
			}
		} else {
			return user.save( omitSensitive( req.body ), { patch: true } ).then( function ( user ) {
				res.send( omitSensitive( user ) );
			});
		}
	}, function ( err ) {
		res.status( 500 ).send( err );
	});
});

var createHash = function(password) {
	return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
};
var isValidPassword = function(user, password) {
	return bCrypt.compareSync(password, user.password || user.get( "password" ) );
};

app.delete( "/services/users/:id",
function ( req, res, next ) {
	var userid = parseInt( req.params.id, 10 ) || 0;
	if ( req.isAdmin ) {
		next();
	} else if ( req.user.attributes.id === userid ) {
		next();
	} else {
		res.status( 401 ).json({
			err: "Must be logged in to delete yourself."
		});
	}
},
function ( req, res ) {
	var userid = parseInt( req.params.id, 10 ) || 0;
	new User({
		'id' : userid
	}).fetch().then( function( user ) {
		if ( !user ) {
			return res.status( 404 ).send({ err: "user (" + userid + ") not found" });
		}

		user.destroy().then(function ( user ) {
			res.send( user );
		}, function ( err ) {
			res.status( 500 ).send( err );
		});

	}, function ( err ) {
		res.status( 500 ).send( err );
	});
});
