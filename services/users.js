var app = require("../app");
var User = require("../models/user");

app.post('/services/users', function(req, res) {
	new User(req.body).save().then(function(){
		res.send(_.omit(req.user.toJSON(), "password"));
	}, function(e){
		res.status(500).send(e);
	});
});