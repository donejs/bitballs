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
 * Stat.getList({where: {gameId: 5 }}).then(function(stats){ ... });
 * new Stat({gameId: 6, playerId: 15, type: "1P", time: 60}).save()
 * ```
 */
import superModel from 'can-super-model';
import QueryLogic from "can-query-logic";
import bookshelfService from "./bookshelf-service";
import DefineMap from 'can-define/map/map';
import DefineList from 'can-define/list/list';
import Player from "bitballs/models/player";

import "can-define-backup";

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
	/**
	 * @property {Number} bitballs/models/stat.properties.id id
	 * @parent bitballs/models/stat.properties
	 * A unique identifier.
	 **/
	id: {type: 'number', identity: true},
	/**
	 * @property {bitballs/models/player} bitballs/models/stat.properties.player player
	 * @parent bitballs/models/player.properties
	 *
	 * Player related to the stats
	 */
	player: {
		Type: Player,
		serialize: false
	},
	/**
	 * @property {Number} bitballs/models/stat.properties.playerId playerId
	 * @parent bitballs/models/player.properties
	 *
	 * Player id of the current stats
	 */
	playerId: 'number',
	/**
	 * @property {Number} bitballs/models/stat.properties.gameId gameId
	 * @parent bitballs/models/player.properties
	 *
	 * Game id of the current stat
	 */
	gameId: 'number',
	/**
	 * @property {Any} bitballs/models/stat.properties.type type
	 * @parent bitballs/models/player.properties
	 *
	 * Type of the stat
	 */
	type: 'any',
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

	default: 'any'
});


/**
 * @property {can-define/list} bitballs/models/stat.static.List List
 * @parent bitballs/models/stat.static
 *
 * Methods on a List of stats.
 */
Stat.List = DefineList.extend('StatsList', {
	"#": Stat,
	get byPlayer() {
		let players = {};

		this.forEach((stat) => {
			if (!players[stat.playerId]) {
				players[stat.playerId] = new Stat.List();
			}

			players[stat.playerId].push(stat);
		});

		return players;
	},
	get players() {
		return Object.keys(this.byPlayer).map((id) => ({ id }));
	},
	get byGame() {
		let games = {};

		this.forEach((stat) => {
			if (!games[stat.gameId]) {
				games[stat.gameId] = new Stat.List();
			}

			games[stat.gameId].push(stat);
		});

		return games;
	},
	get games() {
		return Object.keys(this.byGame).map((id) => ({ id }));
	},
	get aggregated() {
		let aggregated = {};

		this.forEach(({ type }) => {
			if (!aggregated[type]) {
				aggregated[type] = 0;
			}

			aggregated[type]++;
		});

		return [
			...Stat.statTypes.map(({ name }) => ({
				name,
				default: (aggregated[name] || 0).toFixed(0),
			})),
			{
				name: 'TP',
				default: (function() {
					let onePointers = aggregated['1P'] || 0;
					let twoPointers = aggregated['2P'] || 0;

					return (onePointers + twoPointers * 2).toFixed(0);
				})()
			},
			{
				name: 'FG%',
				default: (function() {
					let onePointers = aggregated['1P'] || 0;
					let twoPointers = aggregated['2P'] || 0;
					let onePointAttempts = aggregated['1PA'] || 0;
					let twoPointAttempts = aggregated['2PA'] || 0;

					let successes = onePointers + twoPointers;
					let attempts = onePointAttempts + twoPointAttempts;
					let rate = successes / ( successes + attempts );

					if (isNaN(rate)) {
						return '-';
					}

					return (rate * 100).toFixed(0) + '%';
				})()
			},
		];
	},
});


Stat.connection = superModel({
	Map: Stat,
	List: Stat.List,
	url: {
		resource: "/services/stats",
		contentType: "application/x-www-form-urlencoded"
	},
	name: "stat",
	queryLogic: new QueryLogic(Stat, bookshelfService),
	updateInstanceWithAssignDeep: true
});


export default Stat;
