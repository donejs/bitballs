var app = require("../services/app");
var passport = require('passport');
var User = require("../models/user");
var _ = require("lodash");
var bCrypt = require("bcrypt-nodejs");

/**
 * @module {function} services/session /services/session
 * @parent bitballs.services
 *
 * @signature `GET /services/session`
 *   Gets the current session, if any
 *
 *     GET /services/session
 *
 * @return {JSON} An object containing the logged in user's data, omitting sensitive information.
 *
 *      {
 *        "id": Int,
 *        "name": String,  	// Optional name
 *        "email": String,	// User email address
 *        "isAdmin": Boolean,	// Whether user is an admin
 *        "verified": Boolean // Whether user has verified an email address
 *      }
 * 		
 * @signature `POST /services/session`
 *   If password is valid, logs in the current user and creates a session
 *
 *     POST /services/session
 *          {
 *            "email": "addyfizzle@publicdefenders.org"
 *            "password": "H3HLJ2HIO4"
 *          }
 * 		    
 *  @return {JSON} An object containing the logged in user's data, omitting sensitive information.
 *
 *      {
 *        "id": 9,
 *        "name": "Atticus Finch",
 *        "email": "addyfizzle@publicdefenders.org",
 *        "isAdmin": false,
 *        "verified": true
 *      }
 *
 * @signature `DELETE /services/session`
 *   Logs the current user out.
 *
 *     DELETE /services/session
 *
 *  @return {JSON} Returns an empty JSON object.
 *
 *      {}
 */

passport.serializeUser(function(user, done) {
	done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	new User({
		'id' : id
	}).fetch().then(function(user) {
		done(null, user);
	}, function(err) {
		done(err);
	});
});

var expressSession = require('express-session');

var cookieSecret = process.env.COOKIE_SECRET || 'devSecret';

app.use(expressSession({
	secret : cookieSecret,
	resave : false,
	saveUninitialized : false
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(function ( req, res, next ) {
  req.isAdmin = ( req.user && req.user.attributes && req.user.attributes.isAdmin ) ? true : false;
  next();
});

var isValidPassword = function(user, password) {
	return bCrypt.compareSync(password, user.get("password") );
};

app.get('/services/session', function(req, res) {
	if (req.user) {
		res.send({id: req.user.id, user: _.omit(req.user.toJSON(), "password")});
	} else {
		res.status(404).send(JSON.stringify({
			message : "No session"
		}));
	}
});

app.post('/services/session', function(req, res, next) {
	var email = req.body.user.email,
		password = req.body.user.password;

	new User({
		'email': email
	}).fetch().then(function(user) {
		if(user && isValidPassword(user, password)) {
			req.logIn(user, function(err) {
				if (err) {
					next(err);
				}
				return res.json({user: _.omit(req.user.toJSON(), "password")});
			});
		} else {
			// Security conventions dictate that you shouldn't tell the user whether
			// it was their username or their password that was the problem
			return res.status(401).json({message: "Incorrect username or password"});
		}

	}, function(error) {

		console.log('User error ' + email, error);
		return res.status( 500 ).json( error );

	});
});

app['delete']("/services/session", function(req, res){
	req.logout();
	res.json({});
});
