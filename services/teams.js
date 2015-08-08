
var app = require("../app");
var bookshelf = require("../bookshelf");

var Team = bookshelf.Model.extend({
	tableName: 'teams'
});

app.get('/services/teams', function(req, res){
	Team.fetchAll({}).then(function(teams){
		res.send({data: teams.toJSON()});
	});
});

app.get('/services/teams/:id', function(req, res){
	new Team({id: req.params.id}).fetch().then(function(team){
		res.send(team.toJSON());
	});
});
app.put('/services/teams/:id', function(req, res){
	new Team({id: req.params.id}).save(req.body).then(function(team){
		res.send(team.toJSON());
	});
});

app['delete']('/services/teams/:id', function(req, res){
	new Team({id: req.params.id}).destroy().then(function(team){
		res.send({});
	});
});

app.post('/services/teams', function(req, res) {
	new Team(req.body).save().then(function(team){
		res.send({id: team.get('id')});
	}, function(e){
		res.status(500).send(e);
	});

});
