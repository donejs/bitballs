var app = require("../services/app");
var adminOnly = require( "./adminOnly" );

var Tournament = require("../models/tournament");


/**
 * @module {function} services/tournaments /services/tournaments
 * @parent bitballs.services
 *
 * @signature `GET /services/tournaments`
 *   Gets tournaments from the database.
 *
 * 		GET /services/tournaments?
 * 			where[date]=2016-01-01&
 * 			sortBy=date
 *
 * 	@param {Object} [where] Clause used to filter which tournaments are returned
 * 	@param {String} [sortBy] Clause used to sort the returned stats
 * 	@return {JSON} An object that contains the stats:
 *
 * 		{data: [{
 * 			id: Int,
 * 			date: Date
 * 		}, ...]}
 *
 * @signature `POST /services/tournaments`
 *   Creates a tournament in the database. Only admins are allowed to create tournaments.
 *
 * 		POST /services/tournaments
 * 			{
 * 				"date": "2016-01-01"
 * 			}
 *
 *	@param {JSON} JSONBody The raw JSON properties of a tournament object
 *	@return {JSON} Returns JSON with all the properties of the newly created object, including its id.
 *
 * 		{
 * 			"id": 9,
 * 			"date": "2016-01-01"
 * 		}
 *
 * @signature `GET /services/tournaments/:id`
 *   Gets a tournament by id from the database.
 *
 * 		GET /services/tournaments/9
 *
 * 	@return {JSON} An object that contains the tournament data:
 *
 * 		{
 * 			id: Int,
 * 			date: Date
 * 		}
 *
 * @signature `PUT /services/tournaments/:id`
 *   Updates a tournament in the database. Only admins are allowed to update tournaments.
 *
 * 		PUT /services/tournaments/9
 * 			{
 * 				"date": "2015-01-01"
 * 			}
 *
 * 	@param {JSON} JSONBody The updated properties of the tournament object.
 * 	@return {JSON} Returns JSON with all the properties of the updated object, including its id.
 *
 * 		{
 * 			"id": 9,
 * 			"date": "2015-01-01"
 * 		}
 *
 * @signature `DELETE /services/tournaments/:id`
 *   Deletes a tournament in the database. Only admins are allowed to delete stats.
 *
 * 		DELETE /services/tournaments/9
 *
 * 	@return {JSON} Returns an empty JSON object.
 *
 * 		{}
 */
app.get('/services/tournaments', function(req, res){
	Tournament.collection().query(req.query).fetch().then(function(tournaments){
		res.send({data: tournaments.toJSON()});
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
