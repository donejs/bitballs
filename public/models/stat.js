/**
 * @module {can.Map} bitballs/models/stat Stat
 * @parent bitballs.clientModels
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
	set = require("can-set"),
	can = require("can/util/");

require("can/map/define/");
require("can/list/");


var Stat = can.Map.extend(
/** @static */
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
/** @prototype */
{
	define: {
		/**
		 * @property {Number} time
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
			serialize: false
		}
	}
});

/**
 * @property {can.List} bitballs/models/stat.static.List List
 * @parent bitballs/models/stat.static
 *
 * Methods on a List of stats.
 */
Stat.List = can.List.extend({Map: Stat},{});

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
	Map: Stat,
	List: Stat.List,
	url: "/services/stats",
	name: "stat",
	algebra: Stat.algebra
});

tag("stat-model", statConnection);

module.exports = Stat;
