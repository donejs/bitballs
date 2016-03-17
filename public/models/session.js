/**
 * @module {can.Map} bitballs/models/session Session
 * @parent bitballs.clientModels
 */
var connect = require("can-connect");
var $ = require("jquery");
var can = require("can/util/");
require("can/map/define/");
require("can/list/");
require( "can-connect/constructor/" );
require( "can-connect/can/map/" );
require( "can-connect/can/" );
require( "can-connect/constructor/store/" );
require( "can-connect/constructor/callbacks-once/" );
require( "can-connect/data/callbacks/" );
require( "can-connect/data/parse/" );
require( "can-connect/data/url/" );

var User = require("./user");

var Session = can.Map.extend({
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

connect( behaviors, options );

module.exports = Session;
