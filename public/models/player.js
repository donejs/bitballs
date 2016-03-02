var Map = require('can/map/');
var superMap = require('can-connect/can/super-map/');
var tag = require('can-connect/can/tag/');
var moment = require("moment");
var convertToString = require("./util/convertToString");
require("can/map/define/");

var Player = Map.extend({
	define: {
		weight: {
			type: 'number'
		},
		weightString: convertToString("weight"),
		height: {
			type: 'number'
		},
		heightString: convertToString("height"),
		jsBirthday: {
			get: function(){
				var date = this.attr("birthday");
				return date ? new Date(date) : null;
			}
		},
		birthDate: {
			get: function(){
				var date = this.attr("birthday");
				return date ? moment(date).format('YYYY-MM-DD') : "";
			},
			set: function(value){
				this.attr("birthday", value);
			}
		},
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
	}
});
Player.List = can.List.extend({Map: Player},{
	findById: function(id){
		for(var i = 0; i < this.length; i++) {
			if(this[i].attr("id") === id) {
				return this[i];
			}
		}
	}
});

var playerConnection = superMap({
  Map: Player,
  List: Player.List,
  url: "/services/players",
  name: "player"
});

tag("player-model", playerConnection);

module.exports = Player;