
var app = require("../services/app");
var bookshelf = require("../bookshelf");
var Stat = require("./stats");
var Team = require("./teams");
var adminOnly = require( "../adminOnly" );

var Game = bookshelf.Model.extend({
	tableName: 'games',
	stats: function(){
		return this.hasMany(Stat,"gameId");
	},
	homeTeam: function(){
		return this.belongsTo(Team,"homeTeamId");
	},
	awayTeam: function(){
		return this.belongsTo(Team,"awayTeamId");
	}
});

var Games = bookshelf.Collection.extend({
  model: Game
});

app.get('/services/games', function(req, res){
	new Games().query({where: req.query}).fetch().then(function(games){
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
