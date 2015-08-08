
var app = require("../app");
var bookshelf = require("../bookshelf");

var Player = bookshelf.Model.extend({
	tableName: 'players'
});

app.get('/services/players', function(req, res){
	Player.fetchAll({}).then(function(players){
		res.send({data: players.toJSON()});
	});
});

app.get('/services/players/:id', function(req, res){
	new Player({id: req.params.id}).fetch().then(function(player){
		res.send(player.toJSON());
	});
});
app.put('/services/players/:id', function(req, res){
	new Player({id: req.params.id}).save(req.body).then(function(player){
		res.send(player.toJSON());
	});
});

app['delete']('/services/players/:id', function(req, res){
	new Player({id: req.params.id}).destroy().then(function(player){
		res.send({});
	});
});

app.post('/services/players', function(req, res) {
	new Player(req.body).save().then(function(player){
		res.send({id: player.get('id')});
	}, function(e){
		res.status(500).send(e);
	});

});
