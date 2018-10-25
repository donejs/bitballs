/**
 * @module {can-map} bitballs/models/team Team
 * @parent bitballs.clientModels
 *
 * @group bitballs/models/team.properties 0 properties
 */
import { DefineMap, DefineList, superModel, QueryLogic } from "can";
import bookshelfService from "./bookshelf-service";
import Player from "./player";

var Team = DefineMap.extend('Team', {
	/**
	 * @property {Array}
	 * A list of available team colors.
	 **/
	colors: ["Black","White","Red","Green","Blue","Yellow","Brown","Gray","Orange","Purple"]
},
{
	/**
	 * @property {Number} bitballs/models/team.properties.id id
	 * @parent bitballs/models/team.properties
	 *
	 * A unique identifier.
	 **/
	id: {type: 'number', identity: true},
	/**
	 * @property {Number} bitballs/models/team.properties.tournamentId tournamentId
	 * @parent bitballs/models/team.properties
	 *
	 * The `id` of [bitballs/models/tournament] that the team will be
	 * associated with.
	 **/
	tournamentId: "number",
	/**
	 * @property {bitballs/models/player} bitballs/models/team.properties.player1 player1
	 * @parent bitballs/models/team.properties
	 *
	 * A reference to a [bitballs/models/player] model.
	 **/
	player1: Player,
	/**
	 * @property {bitballs/models/player} bitballs/models/team.properties.player2 player2
	 * @parent bitballs/models/team.properties
	 *
	 * A reference to a [bitballs/models/player] model.
	 **/
	player2: Player,
	/**
	 * @property {bitballs/models/player} bitballs/models/team.properties.player3 player3
	 * @parent bitballs/models/team.properties
	 *
	 * A reference to a [bitballs/models/player] model.
	 **/
	player3: Player,
	/**
	 * @property {bitballs/models/player} bitballs/models/team.properties.player4 player4
	 * @parent bitballs/models/team.properties
	 *
	 * A reference to a [bitballs/models/player] model.
	 **/
	player4: Player,
	/**
	 * @property {String} bitballs/models/team.properties.name name
	 * @parent bitballs/models/team.properties
	 *
	 * Name of the team
	 **/
	name: 'string',
	/**
	 * @property {String} bitballs/models/team.properties.color color
	 * @parent bitballs/models/team.properties
	 *
	 * Team color
	 **/
	color: 'string',
	/**
	 * @property {Number} bitballs/models/team.properties.player1Id player1Id
	 * @parent bitballs/models/team.properties
	 *
	 * id of the player 1.
	 **/
	player1Id: 'number',
	/**
	 * @property {Number} bitballs/models/team.properties.player2Id player1Id
	 * @parent bitballs/models/team.properties
	 *
	 * id of the player 2.
	 **/
	player2Id: 'number',
	/**
	 * @property {Number} bitballs/models/team.properties.player3Id player1Id
	 * @parent bitballs/models/team.properties
	 *
	 * id of the player 3.
	 **/
	player3Id: 'number',
	/**
	 * @property {Number} bitballs/models/team.properties.player4Id player1Id
	 * @parent bitballs/models/team.properties
	 *
	 * id of the player 4.
	 **/
	player4Id: 'number',
	/**
	 * @property {bitballs/models/player.static.List} bitballs/models/team.properties.players players
	 * @parent bitballs/models/team.properties
	 *
	 * A list made up of the [bitballs/models/player] models referenced
	 * by properties [bitballs/models/team.properties.player1],
	 * [bitballs/models/team.properties.player2], [bitballs/models/team.properties.player3],
	 * and [bitballs/models/team.properties.player4].
	 **/
	get players() {
		var players = [],
			self = this;
			["player1","player2","player3","player4"].map(function(name){
			if(self[name]) {
				players.push(self[name]);
			}
		});
		return new Player.List(players);
	}
});
/**
 * @constructor {can-list} bitballs/models/team.static.List List
 * @parent bitballs/models/team.static
 */
Team.List = DefineList.extend('TeamsList',
/** @prototype **/
{
	"#": Team,
	/**
	 * @property {Object}
	 *
	 * A map of team ids to [bitballs/models/team] models.
	 **/
	get idMap() {
		var map = {};

		this.forEach(function(team){
			map[team.id] = team;
		});

		return map;
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
			if(this[i].id === id) {
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
		return this.idMap[id];
	}
});

superModel({
	Map: Team,
	List: Team.List,
	url: {
		resource: "/services/teams",
		contentType: "application/x-www-form-urlencoded"
	},
	name: "team",
	queryLogic: new QueryLogic(Team, bookshelfService),
	updateInstanceWithAssignDeep: true
});

export default Team;
