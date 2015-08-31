var Map = require('can/map/');
var superMap = require('can-connect/can/super-map/');
var connect = require("can-connect");
var tag = require('can-connect/can/tag/');
var moment = require("moment");
require("can/map/define/");

var User = require("./user");

var Session = Map.extend({
	define: {
		user: {
			Type: User
		}
	}
});
Session.List = can.List.extend({Map: Session},{});

var sessionConnection = connect([
	"constructor",
	"can-map",
	"constructor-store",
	"data-callbacks",
	"data-parse",
	"data-url",
	"constructor-callbacks-once"],{
		
	url: {
		getData: "/services/session",
		createData: "/services/session",
		destroyData: "/services/session"
	},
	Map: Session,
	List: Session.List,
	name: "session",
	ajax:
	$.ajax

});

module.exports = Session;