/**
 * @module {can.Map} bitballs/models/tournament Tournament
 * @parent bitballs.clientModels
 *
 * @group bitballs/models/tournament.properties 0 properties
 */
var superMap = require('can-connect/can/super-map/');
var tag = require('can-connect/can/tag/');
var set = require("can-set");
var moment = require('moment');
var can = require("can/util/");
require("can/map/define/");
require("can/list/");

var Tournament = can.Map.extend(
/** @static **/
{},
{
	define: {
		/**
		 * @property {Date} bitballs/models/tournament.properties.jsDate jsDate
		 * @parent bitballs/models/tournament.properties
		 *
		 * The [bitballs/models/tournament.properties.date] converted to a
		 * JavaScript Date object.
		 **/
		jsDate: {
			get: function(){
				var date = this.attr("date");
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
				var jsDate = this.attr("jsDate");
				return jsDate ? jsDate.getFullYear() : null;
			}
		}
		/**
		 * @property {String} bitballs/models/tournament.properties.date date
		 * @parent bitballs/models/tournament.properties
		 *
		 * The date that the tournament is schedule to occur.
		 **/
	}
});

/**
 * @constructor {can.List} bitballs/models/tournament.static.List List
 * @parent bitballs/models/tournament.static
 */
Tournament.List = can.List.extend({Map: Tournament},{});

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
  url: "/services/tournaments",
  name: "tournament",
  algebra: Tournament.algebra
});

tag("tournament-model", tournamentConnection);

module.exports = Tournament;
