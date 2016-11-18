/**
 * @module {can-map} bitballs/models/stat Stat
 * @parent bitballs.clientModels
 *
 * @group bitballs/models/stat.properties 0 properties
 *
 * A [can.Map](https://canjs.com/docs/can.Map.html) that's connected to the [services/stats] with
 * all of [can-connect/can/super-map](https://connect.canjs.com/doc/can-connect%7Ccan%7Csuper-map.html)'s
 * behaviors.
 *
 * @body
 *
 * ## Use
 *
 * Use the `Stat` model to CRUD stats on the server. Use the CRUD methods `getList`, `save`, and `destroy` added to
 * `Stat` by the [can-connect/can/map](https://connect.canjs.com/doc/can-connect%7Ccan%7Cmap.html) behavior.
 *
 *
 * ```
 * var Stat = require("bitballs/models/stat");
 * Stat.getList({where: {gameId: 5}}).then(function(stats){ ... });
 * new Stat({gameId: 6, playerId: 15, type: "1P", time: 60}).save()
 * ```
 */
var superMap = require('can-connect/can/super-map/'),
	tag = require('can-connect/can/tag/'),
	set = require("can-set");
var DefineMap = require('can-define/map/map');
var DefineList = require('can-define/list/list');
var Player = require("bitballs/models/player");


require("can-define-backup");

var Stat = DefineMap.extend('Stat',
{
	/**
	 * @property {Array<{name: String}>} statTypes
	 *
	 * Array of statType objects.  Each object has a name property which
	 * has the short name of the stat.  Ex: `{name: "1P"}`.
	 */
	statTypes: [
			{ name: "1P"},
			{ name: "1PA"},
			{ name: "2P"},
			{ name: "2PA"},
			{ name: "ORB"},
			{ name: "DRB"},
			{ name: "Ast"},
			{ name: "Stl"},
			{ name: "Blk"},
			{ name: "To"}
		]
},
{
	id: 'number',
	/**
	 * @property {Number} bitballs/models/stat.properties.time time
	 * @parent bitballs/models/stat.properties
	 *
	 * The time of the stat, rounded to the nearest integer.
	 */
	time: {
		set: function(newVal){
			return Math.round(newVal);
		}
	},
	// TODO: remove?
	player: {
		Type: Player,
		serialize: false
	},
	playerId: 'number',
	gameId: 'number',
	type: 'any'
});


/**
 * @property {can-list} bitballs/models/stat.static.List List
 * @parent bitballs/models/stat.static
 *
 * Methods on a List of stats.
 */
Stat.List = DefineList.extend({"#": Stat});

/**
 * @property {set.Algebra} bitballs/models/stat.static.algebra algebra
 * @parent bitballs/models/stat.static
 *
 * Set Algebra
 */
Stat.algebra = new set.Algebra(
	new set.Translate("where","where"),
	set.comparators.sort('sortBy')
);

var statConnection = superMap({
	idProp: "id",
	Map: Stat,
	List: Stat.List,
	url: {
		// resource: "/services/stats",
		getData: "/services/stats",
		createData: "/services/stats",
		destroyData: "/services/stats/{id}",
		contentType: "application/x-www-form-urlencoded"
	},
	name: "stat",
	algebra: Stat.algebra
});

tag("stat-model", statConnection);

module.exports = Stat;
