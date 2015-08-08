var Map = require('can/map/');
var superMap = require('can-connect/can/super-map/');
var tag = require('can-connect/can/tag/');
require("can/map/define/");


var Tournament = Map.extend({
	define: {
		jsDate: {
			get: function(){
				var date = this.attr("date");
				return date ? new Date(date) : null;
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