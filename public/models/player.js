/**
 * @module {can.Map} bitballs/models/player Player
 * @parent bitballs.clientModels
 **/
var can = require('can/util/');
var superMap = require('can-connect/can/super-map/');
var tag = require('can-connect/can/tag/');
var moment = require("moment");
var set = require("can-set");

require('can/list/');
require('can/map/');
require("can/map/define/");
require('can/map/backup/');

var Player = can.Map.extend({
	define: {
		weight: {
			type: 'number'
		},
		height: {
			type: 'number'
		},
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
	},
	init: function () {
		this.backup();
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
