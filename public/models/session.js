/**
 * @module {can.Map} bitballs/models/session Session
 * @parent bitballs.client
 */

var Map = require('can/map/');
//var superMap = require('can-connect/can/super-map/');
var connect = require("can-connect");
var tag = require('can-connect/can/tag/');
var moment = require("moment");
require("can/map/define/");

require( "can-connect/constructor/" );
require( "can-connect/can/map/" );
require( "can-connect/can/" );
require( "can-connect/constructor/store/" );
require( "can-connect/constructor/callbacks-once/" );
require( "can-connect/data/callbacks/" );
//require( "can-connect/data/callbacks-cache/" );
//require( "can-connect/data/combine-requests/" );
//require( "can-connect/data/inline-cache/" );
//require( "can-connect/data/localstorage-cache/" );
require( "can-connect/data/parse/" );
require( "can-connect/data/url/" );
//require( "can-connect/fall-through-cache/" );
//require( "can-connect/real-time/" );

var User = require("./user");

var Session = Map.extend({
	define: {
		user: {
			Type: User
		}
	},
	isAdmin: function(){
		return this.attr("user") && this.attr("user").attr("isAdmin");
	}
});
Session.List = can.List.extend({Map: Session},{});

var behaviors = [
	"constructor",
	"can-map",
	"constructor-store",
	"data-callbacks",
	"data-parse",
	"data-url",
	"constructor-callbacks-once"
];

var options = {
	ajax: $.ajax,
	Map: Session,
	List: Session.List,
	//name: "session",
	url: {
		getData: "/services/session",
		createData: "/services/session",
		destroyData: "/services/session"
	}
};

var sessionConnection = connect( behaviors, options );

module.exports = Session;
