/**
 * @module {function} services/stats /services/stats
 * @parent bitballs.services
 *
 * @signature `GET /services/stats`
 *    Gets stats from the database.
 *
 *     GET /services/stats?
 *         where[gameId]=5&
 *         withRelated[]=player
 *         sortBy=time
 *
 *   @param {Object} [where] Clause used to filter which stats are returned.
 *   @param {Array} [withRelated] Clause used to add related data.
 *   @param {String} [sortBy] Clause used to sort the returned stats.
 *   @return {JSON} An object that contains the stats:
 *
 *       {data: [{
 *         id: Int,
 *         gameId: Int,     // Related game
 *         playerId: Int,   // Related player
 *         type: String,    // "1P", "1PA", etc
 *         time: Int,       // time of stat in seconds
 *         value: Int,      // Not currently used, but available.
 *       }, ...]}
 *
 * @signature `POST /services/stats`
 *    Creates a stat in the database.  Only admins are allowed to create stats.
 *
 *     POST /services/stats
 *          {
 *            "gameId": 6,
 *            "playerId": 15,
 *            "type": "1P",
 *            "time": 60
 *          }
 *   @param {JSON} JSONBody The raw JSON properties of a stat object.
 *   @return {JSON} Returns JSON with all the properties of the newly created object, including its id.
 *
 *       {
 *         "id": 9
 *         "gameId": 6,
 *         "playerId": 15,
 *         "type": "1P",
 *         "time": 60
 *       }
 *
 * @signature `GET /services/stats/:id`
 *    Gets a stat by id from the database.
 *
 *     GET /services/stats/5?
 *         withRelated[]=player
 *
 *   @param {Array} [withRelated] Clause used to add related data.
 *   @return {JSON} An object that contains the stats:
 *
 *       {
 *         id: Int,
 *         gameId: Int,     // Related game
 *         playerId: Int,   // Related player
 *         type: String,    // "1P", "1PA", etc
 *         time: Int,       // time of stat in seconds
 *         value: Int,      // Not currently used, but available.
 *       }
 *
 * @signature `PUT /services/stats/:id`
 *    Updates a stat in the database.  Only admins are allowed to update stats.
 *
 *     PUT /services/stats/9
 *         {
 *           "gameId": 6,
 *           "playerId": 15,
 *           "type": "1P",
 *           "time": 120
 *         }
 *
 *   @param {JSON} JSONBody The updated properties of the stat object.
 *   @return {JSON} Returns JSON with all the properties of the updated object, including its id.
 *
 *       {
 *         "id": 9
 *         "gameId": 6,
 *         "playerId": 15,
 *         "type": "1P",
 *         "time": 60
 *       }
 *
 * @signature `DELETE /services/stats/:id`
 *    Deletes a stat in the database.  Only admins are allowed to delete stats.
 *
 *     DELETE /services/stats/9
 *
 *  @return {JSON} Returns an empty JSON object.
 *
 *       {}
 */

var app = require("./app");
var Stat = require("../models/stat");
var adminOnly = require( "./adminOnly" );
var separateQuery = require("./separate-query");

app.get('/services/stats', function(req, res){
	var q = separateQuery(req.query),
    query = q.query,
    fetch = q.fetch;
	Stat.collection().query(query).fetch(fetch).then(function(stats){
		res.send({data: stats.toJSON()});
	});
});

app.get('/services/stats/:id', function(req, res){
	var q = separateQuery(req.query),
    query = q.query,
    fetch = q.fetch;
	new Stat({id: req.params.id}).query(query).fetch(fetch).then(function(stat){
		res.send(stat.toJSON());
	});
});

app.put('/services/stats/:id', adminOnly( "Must be an admin to update stats" ), function(req, res){
	new Stat({id: req.params.id}).save(req.body).then(function(stat){
		res.send(stat.toJSON());
	});
});

app.delete('/services/stats/:id', adminOnly( "Must be an admin to delete stats" ), function(req, res){
	new Stat({id: req.params.id}).destroy().then(function(stat){
		res.send({});
	});
});

app.post('/services/stats', adminOnly( "Must be an admin to create stats" ), function(req, res) {
	new Stat(clean(req.body)).save().then(function(stat){
		res.send({id: stat.get('id')});
	}, function(e){
		res.status(500).send(e);
	});
});

module.exports = Stat;

var clean = function(data){
	if(data.time) {
		data.time = parseInt(data.time, 10);
	}

	return data;
};
