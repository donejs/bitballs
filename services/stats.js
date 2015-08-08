
var app = require("../app");
var bookshelf = require("../bookshelf");

var Stat = bookshelf.Model.extend({
	tableName: 'stats'
});

app.get('/services/stats', function(req, res){
	Stat.fetchAll({}).then(function(stats){
		res.send({data: stats.toJSON()});
	});
});

app.get('/services/stats/:id', function(req, res){
	new Stat({id: req.params.id}).fetch().then(function(stat){
		res.send(stat.toJSON());
	});
});
app.put('/services/stats/:id', function(req, res){
	new Stat({id: req.params.id}).save(req.body).then(function(stat){
		res.send(stat.toJSON());
	});
});

app['delete']('/services/stats/:id', function(req, res){
	new Stat({id: req.params.id}).destroy().then(function(stat){
		res.send({});
	});
});

app.post('/services/stats', function(req, res) {
	new Stat(req.body).save().then(function(stat){
		res.send({id: stat.get('id')});
	}, function(e){
		res.status(500).send(e);
	});

});
