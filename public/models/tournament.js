/**
 * @module {can-map} bitballs/models/tournament Tournament
 * @parent bitballs.clientModels
 *
 * @group bitballs/models/tournament.properties 0 properties
 */
var superMap = require('can-connect/can/super-map/');
var tag = require('can-connect/can/tag/');
var set = require("can-set");
var moment = require('moment');
var DefineMap = require("can-define/map/map");
var DefineList = require("can-define/list/list");
require("can-map-define");

var Tournament = DefineMap.extend('Tournament', {
	id: 'number',
	/**
	 * @property {Date} bitballs/models/tournament.properties.jsDate jsDate
	 * @parent bitballs/models/tournament.properties
	 *
	 * The [bitballs/models/tournament.properties.date] converted to a
	 * JavaScript Date object.
	 **/
	jsDate: {
		get: function(){
			var date = this.date;
			return date ? moment(date).toDate() : null;
		}
	},
	/**
	 * @property {Date} bitballs/models/tournament.properties.year year
	 * @parent bitballs/models/tournament.properties
	 *
	 * The year referred to by [bitballs/models/tournament.properties.jsDate].
	 **/
	year: {
		get: function(){
			var jsDate = this.jsDate;
			return jsDate ? jsDate.getFullYear() : null;
		}
	},
	prettyDate: {
		get: function(){
			var date = this.date;
			return date ? moment(date).toDate() : null;
		}
	},
	/**
	 * @property {String} bitballs/models/tournament.properties.date date
	 * @parent bitballs/models/tournament.properties
	 *
	 * The date that the tournament is schedule to occur.
	 **/
	date: {
		type: 'string'
	}
});

/**
 * @constructor {can-list} bitballs/models/tournament.static.List List
 * @parent bitballs/models/tournament.static
 */
Tournament.List = DefineList.extend({Map: Tournament},{});

/**
 * @property {set.Algebra} bitballs/models/tournament.static.algebra algebra
 * @parent bitballs/models/tournament.static
 *
 * Set Algebra
 */
Tournament.algebra = new set.Algebra(
	new set.Translate("where","where"),
	set.comparators.sort('sortBy')
);

var tournamentConnection = superMap({
  Map: Tournament,
  List: Tournament.List,
  url: {
		resource: "/services/tournaments",
		contentType: "application/x-www-form-urlencoded"
	},
  name: "tournament",
  algebra: Tournament.algebra
});

tag("tournament-model", tournamentConnection);

module.exports = Tournament;
