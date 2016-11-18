/**
 * @module {can-map} bitballs/models/user User
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
var DefineMap = require('can-define/map/map');
var DefineList = require("can-define/list/list");


var User = DefineMap.extend('User', {
	/**
	 * @property {Number} bitballs/models/user.properties.id id
	 * @parent bitballs/models/user.properties
	 *
	 * A unique identifier.
	 **/
	id: 'number',
	/**
	 * @property {String} bitballs/models/user.properties.email email
	 * @parent bitballs/models/user.properties
	 *
	 * Email address representing the user
	 **/
	email: 'string',
	/**
	 * @property {String} bitballs/models/user.properties.password password
	 * @parent bitballs/models/user.properties
	 *
	 * Password for the user
	 **/
	password: 'string',
	/**
	 * @property {String} bitballs/models/user.properties.name name
	 * @parent bitballs/models/user.properties
	 *
	 * User's full name as returned by the server
	 **/
	name: 'string',
	/**
	 * @property {Boolean} bitballs/models/user.properties.isAdmin isAdmin
	 * @parent bitballs/models/user.properties
	 *
	 * A boolean representing if the user has admin rights
	 **/
	isAdmin: 'boolean',
	/**
	 * @property {Boolean} bitballs/models/user.properties.verified verified
	 * @parent bitballs/models/user.properties
	 *
	 * A boolean representing if the user is verified
	 **/
	verified: 'boolean',
	/**
	 * @property {String} bitballs/models/user.properties.verificationHash verificationHash
	 * @parent bitballs/models/user.properties
	 *
	 * A unique hash representing user verification
	 **/
	verificationHash: 'string'
});

/**
 * @constructor {can-list} bitballs/models/user.static.List List
 * @parent bitballs/models/user.static
 */
User.List = DefineList.extend({"#": User});

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
  url: {
	resource: "/services/users",
	contentType: "application/x-www-form-urlencoded"
  },
  name: "user",
  algebra: User.algebra
});

tag("user-model", userConnection);

module.exports = User;
