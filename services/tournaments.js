
var app = require("../services/app");
var bookshelf = require("../models/bookshelf");
var adminOnly = require( "./adminOnly" );

var Tournament = require("../models/tournament");


/**
 * @module {function} services/tournaments /services/tournaments
 * @parent bitballs.services
 */
app.get('/services/tournaments', function(req, res){
	Tournament.collection().query(req.query).fetch().then(function(tournaments){
		res.send({data: tournaments});
	});
});

app.get('/services/tournaments/:id', function(req, res){
	new Tournament({id: req.params.id}).fetch().then(function(tournament){
		res.send(tournament.toJSON());
	});
});

app.put('/services/tournaments/:id', adminOnly( "Must be an admin to update tournaments" ), function(req, res){
	new Tournament({id: req.params.id}).save(req.body).then(function(tournament){
		res.send(tournament.toJSON());
	});
});

app['delete']('/services/tournaments/:id', adminOnly( "Must be an admin to delete tournaments" ), function(req, res){
	new Tournament({id: req.params.id}).destroy().then(function(tournament){
		res.send({});
	});
});

app.post('/services/tournaments', adminOnly( "Must be an admin to create tournaments" ), function(req, res) {
	new Tournament(req.body).save().then(function(tournament){
		res.send({id: tournament.get('id')});
	}, function(e){
		res.status(500).send(e);
	});
});
