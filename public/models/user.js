var Map = require('can/map/');
var superMap = require('can-connect/can/super-map/');
var tag = require('can-connect/can/tag/');
var moment = require("moment");
require("can/map/define/");

var User = Map.extend({});
User.List = can.List.extend({Map: User},{});

var userConnection = superMap({
  Map: User,
  List: User.List,
  url: "/services/users",
  name: "user"
});

tag("user-model", userConnection);

module.exports = User;