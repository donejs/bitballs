
var app = require("../services/app");
var bookshelf = require("../models/bookshelf");
var adminOnly = require( "../adminOnly" );

var Stat = bookshelf.Model.extend({
	tableName: 'stats'
});

var clean = function(data){
	if(data.time) {
		data.time = parseInt(data.time, 10);
	}
	return data;
};

app.get('/services/stats', function(req, res){
	Stat.collection().query(req.query).fetch().fetch().then(function(stats){
		res.send({data: stats.toJSON()});
	});
});

app.get('/services/stats/:id', function(req, res){
	new Stat({id: req.params.id}).fetch().then(function(stat){
		res.send(stat.toJSON());
	});
});

app.put('/services/stats/:id', adminOnly( "Must be an admin to update stats" ), function(req, res){
	new Stat({id: req.params.id}).save(req.body).then(function(stat){
		res.send(stat.toJSON());
	});
});

app['delete']('/services/stats/:id', adminOnly( "Must be an admin to delete stats" ), function(req, res){
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
