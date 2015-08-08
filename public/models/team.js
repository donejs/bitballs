var Map = require('can/map/');
var superMap = require('can-connect/can/super-map/');
var tag = require('can-connect/can/tag/');

var Team = Map.extend({
	colors: ["Black","White","Red","Green","Blue","Yellow","Brown","Gray","Orange","Purple"]
},{
	
});
Team.List = can.List.extend({Map: Team},{});

var teamConnection = superMap({
  Map: Team,
  List: Team.List,
  url: "/services/teams",
  name: "team"
});

tag("team-model", teamConnection);

module.exports = Team;