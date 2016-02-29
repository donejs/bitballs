
var app = require("../app");
var bookshelf = require("../bookshelf");

var Tournament = bookshelf.Model.extend({
	tableName: 'tournaments'
});

app.get('/services/tournaments', function(req, res){
	Tournament.collection().fetch().then(function(tournaments){
		res.send({data: tournaments});
	});
});

app.get('/services/tournaments/:id', function(req, res){
	new Tournament({id: req.params.id}).fetch().then(function(tournament){
		res.send(tournament.toJSON());
	});
});
app.put('/services/tournaments/:id', function(req, res){
	new Tournament({id: req.params.id}).save(req.body).then(function(tournament){
		res.send(tournament.toJSON());
	});
});

app['delete']('/services/tournaments/:id', function(req, res){
	new Tournament({id: req.params.id}).destroy().then(function(tournament){
		res.send({});
	});
});

app.post('/services/tournaments', function(req, res) {
	if(!req.params.date){
		res.status(400).send({type: 'Bad Request', message: 'Tournaments must have a date'})
	}else {
		new Tournament(req.body).save().then(function(tournament){
			res.send({id: tournament.get('id')});
		}, function(e){
			res.status(500).send(e);
		});
	}

});
