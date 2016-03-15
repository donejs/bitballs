
var app = require("../services/app");
var Game = require("../models/game");
var adminOnly = require( "./adminOnly" );

/**
 * @module {function} services/games /services/games
 * @parent bitballs.services
 *
 * @signature `GET /services/games`
 *   Gets games from the database.
 *
 *       GET /services/games?
 *           where[tournamentId]=5&
 *           withRelated[]=homeTeam&withRelated[]=awayTeam&
 *           sortBy=round
 *
 *   @param {Object} [where] Clause used to filter which games are returned.
 *   @param {Array} [withRelated] Clause used to add related data.
 *   @param {String} [sortBy] Clause used to sort the returned games.
 *   @return {connectData} An object that contains the games:
 *
 *       {data: [{
 *         id: Int,
 *         tournamentId: Int,
 *         round: String,
 *         court: String,
 *         videoUrl: String,
 *         homeTeamId: Int,
 *         awayTeamId: Int
 *       }, ...]}
 *
 * @signature `POST /services/games`
 *   Creates a game in the database.  Only admins are allowed to create games.
 *
 *       POST /services/games
 *         {
 *         }
 *
 * @signature `DELETE /services/games`
 *   FOO
 * @signature `GET /services/games/:id`
 *   FOO
 *
 * @signature `PUT /services/games/:id`
 *   FOO
 */


app.get('/services/games', function(req, res){
	Game.collection().query(req.query).fetch().then(function(games){
		res.send({data: games.toJSON()});
	});
});

app.get('/services/games/:id', function(req, res){
	new Game({id: req.params.id}).fetch(req.query).then(function(game){
		res.send(game.toJSON());
	});
});

app.put('/services/games/:id', adminOnly( "Must be an admin to update games" ), function(req, res){
	new Game({id: req.params.id}).save(req.body).then(function(game){
		res.send(game.toJSON());
	});
});

app['delete']('/services/games/:id', adminOnly( "Must be an admin to delete games" ), function(req, res){
	new Game({id: req.params.id}).destroy().then(function(game){
		res.send({});
	});
});

app.post('/services/games', adminOnly( "Must be an admin to create games" ), function(req, res) {
	new Game(req.body).save().then(function(game){
		res.send({id: game.get('id')});
	}, function(e){
		res.status(500).send(e);
	});
});
