var app = require("../app");
var passport = require('passport');
var User = require("../models/user");
var _ = require("lodash");
var bCrypt = require("bcrypt-nodejs");

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
	var email = req.body["user[email]"],
		password = req.body["user[password]"];
		
	new User({
		'email': email
	}).fetch().then(function(user) {
		if(user) {
			// User exists but wrong password, log the error
			if (!isValidPassword(user, password)) {
				res.status(401).json({message: "wrong password"});
			} else {
				req.logIn(user, function(err) {
					if (err) { 
						return next(err); 
					}
					return res.json({id: user.id, user: _.omit(req.user.toJSON(), "password")});
				});
			}
		} else {
			return res.status(401).json({message: "wrong username"});
		}
		
	}, function(error) {

		console.log('User error ' + email, error);
		return done(null, false);

	});
});

app['delete']("/services/session", function(req, res){
	req.logout();
	res.json({});
});
