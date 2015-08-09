
var app = require("../app");
var bookshelf = require("../bookshelf");

var Player = bookshelf.Model.extend({
	tableName: 'players'
});

var clean = function(data){
	if(data.weight) {
		data.weight = parseInt(data.weight, 10);
	}
	if(data.height) {
		data.height = parseInt(data.height, 10);
	}
	return data;
};

app.get('/services/players', function(req, res){
	Player.collection().query(function(qb){
		qb.orderBy('name','DESC'); 
	}).fetch().then(function(players){
		res.send({data: players.toJSON()});
	});
});

app.get('/services/players/:id', function(req, res){
	new Player({id: req.params.id}).fetch().then(function(player){
		res.send(player.toJSON());
	});
});
app.put('/services/players/:id', function(req, res){
	var cleaned = clean(req.body);
	new Player({id: req.params.id}).save(cleaned).then(function(player){
		res.send(player.toJSON());
	});
});

app['delete']('/services/players/:id', function(req, res){
	console.log("DESTROYING", req.params.id);
	new Player({id: req.params.id}).destroy().then(function(player){
		res.send({_destroyed: true});
	});
});

app.post('/services/players', function(req, res) {
	new Player(clean(req.body)).save().then(function(player){
		res.send({id: player.get('id')});
	}, function(e){
		res.status(500).send(e);
	});

});

module.exports = Player;
