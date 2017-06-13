/**
 * @module {function} services/players /services/players
 * @parent bitballs.services
 *
 * @signature `GET /services/players`
 *   Gets players from the database
 *
 *     GET /services/games?
 *         where[playerId]=5&
 *         sortBy=startRank
 *
 * @param {Object} [where] Clause used to filter which players are returned.
 * @param {String} [sortBy] Clause used to sort the returned players
 * @return {JSON} An object that contains the player data:
 *
 *     {data: [{
 *         id: Int,
 *         name: String,		// Player name
 *         weight: Int,			// Player weight, in lbs
 *         height: Int,			// Player height, in inches
 *         birthday: Date, 		// Player birthday
 *         profile: String, 	// Player description/bio
 *         startRank: String	// Starting Rank
 *     }]}
 *
 * @signature `POST /services/players`
 *   Adds a player to the database. Only admins are allowed to create players.
 *
 *     POST /services/players
 *          {
 *            "name": "Harper Lee",
 *            "weight": 190,
 *            "height": 72,
 *            "birthday": "1990-01-22",
 *            "profile": "Author of 'To Kill a Mockingbird'",
 *            "startRank": "novice"
 *          }
 *
 * @param {JSON} JSONBody The Raw JSON properties of a player object
 * @return {JSON} Returns JSON with all the properties of the newly created object, including its id
 *
 *     {
 *       "id": 9,
 *       "name": "Harper Lee",
 *       "weight": 190,
 *       "height": 72,
 *       "birthday": "1990-01-22",
 *       "profile": "Author of 'To Kill a Mockingbird'",
 *       "startRank": "novice"
 *     }
 *
 *  @signature `GET /services/players/:id`
 *	  Gets a player by id from the database.
 *
 *      GET /services/players/9
 *
 *  @return {JSON} An object that contains the player data:
 *
 *      {data: [{
 * 	      id: Int,
 * 	      name: String,		// Player name
 * 	      weight: Int,		// Player weight, in lbs
 * 	      height: Int,		// Player height, in inches
 * 	      birthday: Date 		// Player birthday
 * 	      profile: String 	// Player description/bio
 * 	      startRank: String	// Starting Rank
 *      }]}
 *
 * @signature `PUT /services/players/:id`
 *   Updates a player in the database. Only admins are allowed to update players.
 *
 *     PUT /services/players/9
 *         {
 *           "name": "Harper Lee",
 * 	         "weight": 190,
 * 		     "height": 72,
 * 	         "birthday": "1990-01-22",
 * 		     "profile": "Author of 'To Kill a Mockingbird' and `Absalom, Absalom`",
 * 		     "startRank": "novice"
 * 		   }
 *
 *  @param {JSON} JSONBody The updated properties of the player object
 *  @return {JSON} Returns JSON with all the properties of the updated object, including its id.
 *
 *      {
 *        "name": "Harper Lee",
 *        "weight": 190,
 *        "height": 72,
 *        "birthday": "1990-01-22",
 *        "profile": "Author of 'To Kill a Mockingbird' and `Absalom, Absalom`",
 *        "startRank": "novice"
 *      }
 *
 * @signature `DELETE /services/players/:id`
 *    Deletes a player in the database. Only admins are allowed to delete players.
 *
 *		DELETE /services/players/9
 *
 *  @return {JSON} Returns and empty JSON object.
 *
 *      {}
 */

var app = require("./app");
var Player = require("../models/player");
var adminOnly = require( "./adminOnly" );
var separateQuery = require("./separate-query");

app.get('/services/players', function(req, res){
	var q = separateQuery(req.query),
    query = q.query,
    fetch = q.fetch;
	Player.collection().query(query).fetch(fetch).then(function(players){
		res.send({data: players.toJSON()});
	});
});

app.get('/services/players/:id', function(req, res){
	var q = separateQuery(req.query),
    query = q.query,
    fetch = q.fetch;
	new Player({id: req.params.id}).query(query).fetch(fetch).then(function(player){
		res.send(player.toJSON());
	});
});

app.put('/services/players/:id', adminOnly( "Must be an admin to update players" ), function(req, res){
	var cleaned = clean(req.body);
	new Player({id: req.params.id}).save(cleaned).then(function(player){
		res.send(player.toJSON());
	});
});

app.delete('/services/players/:id', adminOnly( "Must be an admin to delete players" ), function(req, res){
	new Player({id: req.params.id}).destroy().then(function(player){
		res.send({_destroyed: true});
	});
});

app.post('/services/players', adminOnly( "Must be an admin to create players" ), function(req, res) {
	new Player(clean(req.body)).save().then(function(player){
		res.send({id: player.get('id')});
	}, function(e){
		res.status(500).send(e);
	});
});

module.exports = Player;

var clean = function(data){
	if(data.name === ''){
		delete data.name;
	}

	if(data.weight) {
		data.weight = parseInt(data.weight, 10);
	}

	if(data.height) {
		data.height = parseInt(data.height, 10);
	}

	return data;
};
