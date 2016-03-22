/**
 * @module {can.Map} bitballs/models/user User
 * @parent bitballs.clientModels
 *
 * @group bitballs/models/user.static 0 static
 *
 * A [can.Map](https://canjs.com/docs/can.Map.html) that's connected to the [services/users] with
 * all of [can-connect/can/super-map](https://connect.canjs.com/doc/can-connect%7Ccan%7Csuper-map.html)'s
 * behaviors.
 *
 * @body
 *
 * ## Use
 *
 * Use the `User` model to CRUD users on the server. Use the CRUD methods `getList`, `save`, and `destroy` added to
 * `User` by the [can-connect/can/map](https://connect.canjs.com/doc/can-connect%7Ccan%7Cmap.html) behavior.
 *
 *
 * ```
 * var User = require("bitballs/models/user");
 * User.getList({where: {gameId: 5}}).then(function(users){ ... });
 * new User({gameId: 6, playerId: 15, type: "1P", time: 60}).save()
 * ```
 */
var superMap = require('can-connect/can/super-map/');
var tag = require('can-connect/can/tag/');
var set = require("can-set");
var can = require("can/util/");
require("can/map/define/");
require("can/list/");

var User = can.Map.extend({});

/**
 * @constructor {can.List} bitballs/models/user.static.List List
 * @parent bitballs/models/user.static
 */
User.List = can.List.extend({Map: User},{});

/**
 * @property {set.Algebra} bitballs/models/user.static.algebra algebra
 * @parent bitballs/models/user.static
 *
 * Set Algebra
 */
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
