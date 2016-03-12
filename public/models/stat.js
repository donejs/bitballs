var Map = require('can/map/');
var superMap = require('can-connect/can/super-map/');
var tag = require('can-connect/can/tag/');
var set = require("can-set");
require("can/map/define/");


var Stat = Map.extend({
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
},{
	define: {
		time: {
			set: function(newVal){
				return Math.round(newVal);
			}
		},
		player: {
			serialize: false
		}
	}
});
Stat.List = can.List.extend({Map: Stat},{});

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