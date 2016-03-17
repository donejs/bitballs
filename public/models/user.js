var superMap = require('can-connect/can/super-map/');
var tag = require('can-connect/can/tag/');
var set = require("can-set");
var can = require("can/util/");
require("can/map/define/");
require("can/list/");

var User = can.Map.extend({});
User.List = can.List.extend({Map: User},{});

User.algebra = new set.Algebra(
	new set.Translate("where","where"),
	set.comparators.sort('sortBy')
);

var userConnection = superMap({
  Map: User,
  List: User.List,
  url: "/services/users",
  name: "user",
  algebra: User.algebra
});

tag("user-model", userConnection);

module.exports = User;
