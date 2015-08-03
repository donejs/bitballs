
var app = require("../app");
var bookshelf = require("../bookshelf");

var Player = bookshelf.Model.extend({
	tableName: 'players'
});

app.get('/players', function(req, res){
	Player.fetchAll({}).then(function(players){
		res.send({data: players.toJSON()});
	});
});

app.get('/players/:id', function(req, res){
	new Player({id: req.params.id}).fetch().then(function(player){
		res.send(player.toJSON());
	});
});

app.post('/players', function(req, res) {
	new Player(req.body).save().then(function(player){
		res.send({id: player.get('id')});
	}, function(e){
		res.status(500).send(e);
	});

});
