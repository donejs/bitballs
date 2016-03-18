var superMap = require('can-connect/can/super-map/');
var tag = require('can-connect/can/tag/');
var set = require("can-set");
var moment = require('moment');
var can = require("can/util/");
require("can/map/define/");
require("can/list/");

var Tournament = can.Map.extend({
	define: {
		jsDate: {
			get: function(){
				var date = this.attr("date");
				return date ? moment(date).toDate() : null;
			}
		},
		year: {
			get: function(){
				var jsDate = this.attr("jsDate");
				return jsDate ? jsDate.getFullYear() : null;
			}
		}
	}
});
Tournament.List = can.List.extend({Map: Tournament},{});

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
