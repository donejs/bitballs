var Map = require('can/map/');
var superMap = require('can-connect/can/super-map/');
var tag = require('can-connect/can/tag/');
var moment = require('moment');
require("can/map/define/");


var Tournament = Map.extend({
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

var tournamentConnection = superMap({
  Map: Tournament,
  List: Tournament.List,
  url: "/services/tournaments",
  name: "tournament"
});

tag("tournament-model", tournamentConnection);

module.exports = Tournament;