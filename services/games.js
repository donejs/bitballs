
var app = require("../app");
var bookshelf = require("../bookshelf");

var Game = bookshelf.Model.extend({
	tableName: 'games'
});

app.get('/services/games', function(req, res){
	Game.fetchAll({}).then(function(games){
		res.send({data: games.toJSON()});
	});
});

app.get('/services/games/:id', function(req, res){
	new Game({id: req.params.id}).fetch().then(function(game){
		res.send(game.toJSON());
	});
});
app.put('/services/games/:id', function(req, res){
	new Game({id: req.params.id}).save(req.body).then(function(game){
		res.send(game.toJSON());
	});
});

app['delete']('/services/games/:id', function(req, res){
	new Game({id: req.params.id}).destroy().then(function(game){
		res.send({});
	});
});

app.post('/services/games', function(req, res) {
	new Game(req.body).save().then(function(game){
		res.send({id: game.get('id')});
	}, function(e){
		res.status(500).send(e);
	});

});
