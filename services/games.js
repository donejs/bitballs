
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
 *            "tournamentId": 1,
 *         	  "round": 'Final',
 *         	  "court": 'Old court'
 *         	  "videoUrl": '?v=2141232213',
 *         	  "homeTeamId": 1
 *         	  "awayTeamId": 1
 *         }
 *
 * 	@param {JSON} JSONBody The raw JSON properties of a game object
 * 	@return {JSON} Returns JSON with all the properties of the newly created object, including its id.
 *
 * 		{
 * 	 	  "id": 9,
 *        "tournamentId": 1,
 *        "round": 'Final',
 *        "court": 'Old court'
 *        "videoUrl": '?v=2141232213',
 *        "homeTeamId": 1
 *        "awayTeamId": 1
 * 		}
 *
 *
 * @signature `GET /services/games/:id`
 *   Gets a game by id from the database
 *
 * 		GET /services/games/9?
 * 			withRelated[]=homeTeam
 *
 *   @param {Array} [withRelated] Clause used to add related data.
 *   @return {JSON} An object that contains the game data:
 *
 *	     {
 *         id: Int,
 *         tournamentId: Int,
 *         round: String,
 *         court: String,
 *         videoUrl: String,
 *         homeTeamId: Int,
 *         awayTeamId: Int
 *       }
 *
 * @signature `PUT /services/games/:id`
 *   Updates a game in the database. Only admins are allowed to update games.
 *
 * 	    PUT /services/games/9
 *        {
 *          "tournamentId": 1,
 *          "round": 'Final',
 *          "court": 'New court'
 *         	"videoUrl": '?v=2141232213',
 *          "homeTeamId": 1
 *          "awayTeamId": 1
 *        }
 *
 * 	@param {JSON} JSONBody The updated properties of the game object
 * 	@return {JSON} Returns JSON with all the properties of the updated object, including its id.
 *
 * 		{
 * 	 	  "id": 9,
 *        "tournamentId": 1,
 *        "round": 'Final',
 *        "court": 'New court'
 *        "videoUrl": '?v=2141232213',
 *        "homeTeamId": 1
 *        "awayTeamId": 1
 * 		}
 * 
 *
 * @signature `DELETE /services/games`
 *   Deletes a game in the database. Only admins are allowed to delete games.
 *
 * 		DELETE /services/games/9
 *
 * 	@return {JSON} Returns an empty JSON object.
 *
 * 		{}
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
