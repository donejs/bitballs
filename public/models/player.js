/**
 * @module {can.Map} bitballs/models/player Player
 * @parent bitballs.clientModels
 *
 * @group bitballs/models/player.properties 0 properties
 */
var can = require('can/util/');
var superMap = require('can-connect/can/super-map/');
var tag = require('can-connect/can/tag/');
var moment = require("moment");
var set = require("can-set");

require('can/list/');
require('can/map/');
require("can/map/define/");
require('can/map/backup/');

var Player = can.Map.extend(
/** @static */
{},
/** @prototype **/
{
	define: {
		/**
		 * @property {Number} bitballs/models/player.properties.weight weight
		 * @parent bitballs/models/player.properties
		 *
		 * The weight of a player in pounds.
		 **/
		weight: {
			type: 'number'
		},
		/**
		 * @property {Number} bitballs/models/player.properties.height height
		 * @parent bitballs/models/player.properties
		 *
		 * The height of a player in inches.
		 **/
		height: {
			type: 'number'
		},
		/**
		 * @property {Date|null} bitballs/models/player.properties.jsBirthday jsBirthday
		 * @parent bitballs/models/player.properties
		 *
		 * The [bitballs/models/player.properties.birthday birthday] property
		 * represented as a JavaScript object.
		 **/
		jsBirthday: {
			get: function(){
				var date = this.attr("birthday");
				return date ? new Date(date) : null;
			}
		},
		/**
		 * @property {String} bitballs/models/player.properties.birthDate birthDate
		 * @parent bitballs/models/player.properties
		 *
		 * The [bitballs/models/player.properties.birthday birthday] property
		 * formatted as `YYYY-MM-DD`.
		 **/
		birthDate: {
			get: function(){
				var date = this.attr("birthday");
				return date ? moment(date).format('YYYY-MM-DD') : "";
			},
			set: function(value){
				this.attr("birthday", value);
			}
		},
		/**
		 * @property {Number} bitballs/models/player.properties.age age
		 * @parent bitballs/models/player.properties
		 *
		 * The number of full years since the date of the
		 * [bitballs/models/player.properties.jsBirthday jsBirthday] property.
		 **/
		age: {
			get: function(){
				var birthDate = this.attr("jsBirthday");
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
		}
		/**
		 * @property {String} bitballs/models/player.properties.birthday birthday
		 * @parent bitballs/models/player.properties
		 *
		 * The player's date of birth. Formatted as `YYYY-MM-DD`.
		 **/
		/**
		 * @property {String} bitballs/models/player.properties.name name
		 * @parent bitballs/models/player.properties
		 *
		 * The name of the player.
		 **/
	 	/**
		 * @property {Number} bitballs/models/player.properties.id id
		 * @parent bitballs/models/player.properties
		 *
		 * A unique identifier.
		 **/

	},
	/**
	 * @function
	 *
	 * Backs up the model's properties on instantiation.
	 **/
	init: function () {
		this.backup();
	}
});

/**
 * @constructor {can.List} bitballs/models/player.static.List List
 * @parent bitballs/models/player.static
 */
Player.List = can.List.extend({Map: Player},
/** @prototype **/
{
	define: {
		/**
		 * @property {Object}
		 *
		 * A map of player ids to [bitballs/models/player] models.
		 **/
		idMap: {
			type: "*",
			get: function(){

				var map = {};

				this.each(function(player){
					map[player.attr("id")] = player;
				});

				return map;
			}
		}
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
		return this.attr("idMap")[id];
	}
});

/**
 * @property {set.Algebra} bitballs/models/player.static.algebra algebra
 * @parent bitballs/models/player.static
 *
 * Set Algebra
 */
Player.algebra = new set.Algebra(
	new set.Translate("where","where"),
	set.comparators.sort('orderBy')
);

var playerConnection = superMap({
  Map: Player,
  List: Player.List,
  url: "/services/players",
  name: "player",
  algebra: Player.algebra
});

tag("player-model", playerConnection);

module.exports = Player;
