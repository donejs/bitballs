/**
 * @module {can-map} bitballs/models/player Player
 * @parent bitballs.clientModels
 *
 * @group bitballs/models/player.properties 0 properties
 */
var superModel = require('can-super-model');
var QueryLogic = require("can-query-logic");
var bookshelfService = require("./bookshelf-service").default;
var moment = require("moment");
var DefineList = require('can-define/list/list');
var DefineMap = require("can-define/map/map");
var defineBackup = require('can-define-backup');

var Player = DefineMap.extend('Player', {
	/**
	 * @property {Number} bitballs/models/player.properties.id id
	 * @parent bitballs/models/player.properties
	 *
	 * A unique identifier.
	 **/
	id: {type: 'number', identity: true},

	/**
	 * @property {String} bitballs/models/player.properties.birthday birthday
	 * @parent bitballs/models/player.properties
	 *
	 * The player's date of birth. Formatted as `YYYY-MM-DD`.
	 **/
	birthday: 'any',
	/**
	 * @property {String} bitballs/models/player.properties.name name
	 * @parent bitballs/models/player.properties
	 *
	 * The name of the player.
	 **/
	name: 'string',
	/**
	 * @property {Number} bitballs/models/player.properties.weight weight
	 * @parent bitballs/models/player.properties
	 *
	 * The weight of a player in pounds.
	 **/
	weight: 'number',
	/**
	 * @property {Number} bitballs/models/player.properties.height height
	 * @parent bitballs/models/player.properties
	 *
	 * The height of a player in inches.
	 **/
	height: 'number',

	// flag set by the api when a player is destroyed
	_destroyed: 'boolean',

	profile: 'any',

	startRank: 'any',

	/**
	 * @function
	 *
	 * Backs up the model's properties on instantiation.
	 **/
	init: function () {
		this.backup();
	},
	/**
	 * @property {Date|null} bitballs/models/player.properties.jsBirthday jsBirthday
	 * @parent bitballs/models/player.properties
	 *
	 * The [bitballs/models/player.properties.birthday birthday] property
	 * represented as a JavaScript object.
	 **/
	get jsBirthday() {
		var date = this.birthday;
		return date ? new Date(date) : null;
	},
	/**
	 * @property {String} bitballs/models/player.properties.birthDate birthDate
	 * @parent bitballs/models/player.properties
	 *
	 * The [bitballs/models/player.properties.birthday birthday] property
	 * formatted as `YYYY-MM-DD`.
	 **/
	get birthDate() {
		var date = this.birthday;
		return date ? moment(date).format('YYYY-MM-DD') : "";
	},
	set birthDate(value) {
		this.birthday = value;
	},
	/**
	 * @property {Number} bitballs/models/player.properties.age age
	 * @parent bitballs/models/player.properties
	 *
	 * The number of full years since the date of the
	 * [bitballs/models/player.properties.jsBirthday jsBirthday] property.
	 **/
	get age() {
		var birthDate = this.jsBirthday;
		if(birthDate) {
			var today = new Date();
			var age = today.getFullYear() - birthDate.getFullYear();
			var m = today.getMonth() - birthDate.getMonth();
			if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
				age--;
			}
			return age;
		}
	}
});
defineBackup(Player);

/**
 * @constructor {can-list} bitballs/models/player.static.List List
 * @parent bitballs/models/player.static
 */
Player.List = DefineList.extend('PlayerList',
/** @prototype **/
{
	"#": Player,
	/**
	 * @property {Object}
	 *
	 * A map of player ids to [bitballs/models/player] models.
	 **/
	get idMap() {
		var map = {};
		this.forEach(function(player){
			map[player.id] = player;
		});

		return map;
	},

	/**
	 * @function
	 *
	 * Returns a Player in the list of players given its id.
	 *
	 * @param {Number} id
	 * @return {bitballs/models/player|undefined} The player if it exists.
	 */
	getById: function(id){
		return this.idMap[id];
	}
});

Player.connection = superModel({
	Map: Player,
	List: Player.List,
	url: {
		resource: "/services/players",
		contentType: 'application/x-www-form-urlencoded'
	},
	name: "player",
	queryLogic: new QueryLogic(Player, bookshelfService),
	updateInstanceWithAssignDeep: true
});




module.exports = Player;
