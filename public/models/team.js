/**
 * @module {can-map} bitballs/models/team Team
 * @parent bitballs.clientModels
 *
 * @group bitballs/models/team.properties 0 properties
 */
var superMap = require('can-connect/can/super-map/');
var tag = require('can-connect/can/tag/');
var set = require("can-set");
var Player = require("./player");
var CanMap = require("can-map");
var CanList = require("can-list");
require("can-map-define");


var Team = CanMap.extend(
/** @static */
{
	/**
	 * @property {Array}
	 * A list of available team colors.
	 **/
	colors: ["Black","White","Red","Green","Blue","Yellow","Brown","Gray","Orange","Purple"]
},
{
	define: {
		/**
		 * @property {Number} bitballs/models/team.properties.tournamentId tournamentId
		 * @parent bitballs/models/team.properties
		 *
		 * The `id` of [bitballs/models/tournament] that the team will be
		 * associated with.
		 **/
		tournamentId: {
			type: "number"
		},
		/**
		 * @property {bitballs/models/player} bitballs/models/team.properties.player1 player1
		 * @parent bitballs/models/team.properties
		 *
		 * A reference to a [bitballs/models/player] model.
		 **/
		player1: {
			Type: Player
		},
		/**
		 * @property {bitballs/models/player} bitballs/models/team.properties.player2 player2
		 * @parent bitballs/models/team.properties
		 *
		 * A reference to a [bitballs/models/player] model.
		 **/
		player2: {
			Type: Player
		},
		/**
		 * @property {bitballs/models/player} bitballs/models/team.properties.player3 player3
		 * @parent bitballs/models/team.properties
		 *
		 * A reference to a [bitballs/models/player] model.
		 **/
		player3: {
			Type: Player
		},
		/**
		 * @property {bitballs/models/player} bitballs/models/team.properties.player4 player4
		 * @parent bitballs/models/team.properties
		 *
		 * A reference to a [bitballs/models/player] model.
		 **/
		player4: {
			Type: Player
		},
		/**
		 * @property {bitballs/models/player.static.List} bitballs/models/team.properties.players players
		 * @parent bitballs/models/team.properties
		 *
		 * A list made up of the [bitballs/models/player] models referenced
		 * by properties [bitballs/models/team.properties.player1],
		 * [bitballs/models/team.properties.player2], [bitballs/models/team.properties.player3],
		 * and [bitballs/models/team.properties.player4].
		 **/
		players: {
			get: function(){

				var players = [],
					self = this;

				 ["player1","player2","player3","player4"].map(function(name){
					if(self.attr(name)) {
						players.push(self.attr(name));
					}
				});

				return new Player.List(players);
			}
		}
	}
	/**
	 * @property {Number} bitballs/models/team.properties.id id
	 * @parent bitballs/models/team.properties
	 *
	 * A unique identifier.
	 **/
});
/**
 * @constructor {can-list} bitballs/models/team.static.List List
 * @parent bitballs/models/team.static
 */
Team.List = CanList.extend({Map: Team},
/** @prototype **/
{
	define: {
		/**
		 * @property {Object}
		 *
		 * A map of team ids to [bitballs/models/team] models.
		 **/
		idMap: {
			type: "*",
			get: function(){
				var map = {};

				this.each(function(team){
					map[team.attr("id")] = team;
				});

				return map;
			}
		}
	},
	/**
	 * @function
	 *
	 * Iterates the list of the [bitballs/models/team] models and removes the
	 * [bitballs/models/team] with the specified `id`.
	 *
	 * @param {Number} id
	 **/
	removeById: function(id){
		var i  = 0;
		while(i < this.length) {
			if(this[i].attr("id") === id) {
				this.splice(i, 1);
			} else {
				i++;
			}
		}
	},
	/**
	 * @function
	 * Returns a Team in the list of teams given its id.
	 * @param {Number} id
	 * @return {bitballs/models/team|undefined} The team if it exists.
	 */
	getById: function(id){
		return this.attr("idMap")[id];
	}
});

/**
 * @property {set.Algebra} bitballs/models/team.static.algebra algebra
 * @parent bitballs/models/team.static
 *
 * Set Algebra
 */
Team.algebra = new set.Algebra(
	new set.Translate("where","where"),
	set.comparators.sort('sortBy')
);

var teamConnection = superMap({
  Map: Team,
  List: Team.List,
  url: "/services/teams",
  name: "team",
  algebra: Team.algebra
});

tag("team-model", teamConnection);

module.exports = Team;
