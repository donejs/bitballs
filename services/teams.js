var app = require("../services/app");
var Team = require("../models/team");
var adminOnly = require( "./adminOnly" );

/**
 * @module {function} services/teams /services/teams
 * @parent bitballs.services
 *
 * @signature `GET /services/teams`
 *   Gets teams from the database.
 *
 *       GET /services/teams?
 *           where[tournamentId]=5&
 *           withRelated[]=player1&
 *           withRelated[]=player2&
 *           withRelated[]=player3&
 *           withRelated[]=player4
 *           sortBy=name
 *
 *   @param {Object} [where] Clause used to filter which teams are returned.
 *   @param {Array} [withRelated] Clause used to add related data.
 *   @param {String} [sortBy] Clause used to sort the returned teams.
 *   @return {JSON} An object that contains the teams:
 *
 *       {data: [{
 *         id: Int,
 *         tournamentId: Int,   // Related tournament
 *         name: String,		// Team name
 *         color: String,		// Team's jersey color
 *         player1Id: Int,		// Related first player
 *         player2Id: Int,		// Related second player
 *         player3Id: Int,		// Related third player
 *         player4Id: Int 		// Related fourth player
 *       }, ...]}
 *
 * @signature `POST /services/teams`
 *   Creates a team in the database.  Only admins are allowed to create teams.
 *
 *       POST /services/teams
 *         {
 *           "tournamentId": 1,
 *           "name": "Tequila Mockingbird",
 *           "color": "Gregory Peck Gray",
 *           "player1Id": 1,
 *           "player2Id": 2,
 *           "player3Id": 3,
 *           "player4Id": 4
 *         }
 *         
 *   @param {JSON} JSONBody The raw JSON properties of a team object.
 *   @return {JSON} Returns JSON with all the properties of the newly created object, including its id.
 *
 *       {
 *         "id": 9
 *         "tournamentId": 1,
 *         "name": "Tequila Mockingbird",
 *         "color": "Gregory Peck Gray",
 *         "player1Id": 1,
 *         "player2Id": 2,
 *         "player3Id": 3,
 *         "player4Id": 4
 *       }
 *
 * @signature `GET /services/teams/:id`
 *   Gets a team by id from the database.
 *
 *       GET /services/teams/5?
 *           withRelated[]=player1&
 *           withRelated[]=player2&
 *           withRelated[]=player3&
 *           withRelated[]=player4
 *
 *   @param {Array} [withRelated] Clause used to add related data.
 *   @return {JSON} An object that contains the team data:
 *
 *       {
 *         id: Int,
 *         tournamentId: Int,   // Related tournament
 *         name: String,		// Team name
 *         color: String,		// Team's jersey color
 *         player1Id: Int,		// Related first player
 *         player2Id: Int,		// Related second player
 *         player3Id: Int,		// Related third player
 *         player4Id: Int 		// Related fourth player
 *       }
 *
 * @signature `PUT /services/stats/:id`
 *   Updates a team in the database.  Only admins are allowed to update teams.
 *
 *       PUT /services/teams/9
 *         {
 *           "tournamentId": 1,
 *           "name": "Tequila Mockingbird is an Unoriginal Team Name",
 *           "color": "Gregory Peck Gray",
 *           "player1Id": 1,
 *           "player2Id": 2,
 *           "player3Id": 3,
 *           "player4Id": 4
 *         }
 *
 *   @param {JSON} JSONBody The updated properties of the team object.
 *   @return {JSON} Returns JSON with all the properties of the updated object, including its id.
 *
 *       {
 *         "id": 9,
 *         "tournamentId": 1,
 *         "name": "Tequila Mockingbird is an Unoriginal Team Name",
 *         "color": "Gregory Peck Gray",
 *         "player1Id": 1,
 *         "player2Id": 2,
 *         "player3Id": 3,
 *         "player4Id": 4
 *       gi}
 *
 * @signature `DELETE /services/teams/:id`
 *   Deletes a team in the database.  Only admins are allowed to delete teams.
 *
 *       DELETE /services/teams/9
 *
 *   @return {JSON} Returns an empty JSON object.
 *
 *       {}
 */
app.get('/services/teams', function(req, res){
	Team.collection().query(req.query).fetch().then(function(teams){
		res.send({data: teams.toJSON()});
	});
});

app.get('/services/teams/:id', function(req, res){
	new Team({id: req.params.id}).fetch().then(function(team){
		res.send(team.toJSON());
	});
});

app.put('/services/teams/:id', adminOnly( "Must be an admin to update teams" ), function(req, res){
	new Team({id: req.params.id}).save(req.body).then(function(team){
		res.send(team.toJSON());
	});
});

app['delete']('/services/teams/:id', adminOnly( "Must be an admin to delete teams" ), function(req, res){
	new Team({id: req.params.id}).destroy().then(function(team){
		res.send({});
	});
});

app.post('/services/teams', adminOnly( "Must be an admin to create teams" ), function(req, res) {
	new Team(req.body).save().then(function(team){
		res.send({id: team.get('id')});
	}, function(e){
		res.status(500).send(e);
	});
});
