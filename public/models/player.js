var Map = require('can/map/');
var superMap = require('can-connect/can/super-map/');
var tag = require('can-connect/can/tag/');

var Player = Map.extend({
	
});
Player.List = can.List.extend({Map: Player},{});

var playerConnection = superMap({
  Map: Player,
  List: Player.List,
  url: "/services/players",
  name: "player"
});

tag("player-model", playerConnection);

module.exports = Player;