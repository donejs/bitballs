
var app = require("../services/app");
var bookshelf = require("../models/bookshelf");
var Player = require("./players");
var adminOnly = require( "../adminOnly" );

var Team = bookshelf.Model.extend({
	tableName: 'teams',
	player1: function(){
		return this.belongsTo(Player,"player1Id");
	},
	player2: function(){
		return this.belongsTo(Player,"player2Id");
	},
	player3: function(){
		return this.belongsTo(Player,"player3Id");
	},
	player4: function(){
		return this.belongsTo(Player,"player4Id");
	}
});

var Teams = bookshelf.Collection.extend({
  model: Team
});

app.get('/services/teams', function(req, res){
	Team.collection().query({where: req.query}).fetch().then(function(teams){
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

module.exports = Team;
