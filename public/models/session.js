/**
 * @module {can.Map} bitballs/models/session Session
 * @parent bitballs.clientModels
 *
 * @group bitballs/models/session.properties 0 properties
 */
var connect = require("can-connect");
var $ = require("jquery");
var can = require("can/util/");
var tag = require('can-connect/can/tag/');

require("can/map/define/");
require("can/list/");
require( "can-connect/constructor/" );
require( "can-connect/can/map/" );
require( "can-connect/constructor/store/" );
require( "can-connect/constructor/callbacks-once/" );
require( "can-connect/data/callbacks/" );
require( "can-connect/data/parse/" );
require( "can-connect/data/url/" );

var User = require("./user");

var Session = can.Map.extend(
/** @static **/
{},
/** @prototype **/
{
	define: {
		/**
		 * @property {bitballs/models/user} bitballs/models/session.properties.user user
		 * @parent bitballs/models/session.properties
		 *
		 * The [bitballs/models/user] model this session represents.
		 **/
		user: {
			Type: User
		}
	},

	/**
	 * @function
	 *
	 * Identifies whether or not the [bitballs/models/session.properties.user]
	 * property is an administrator.
	 *
	 * @return {Boolean}
	 **/
	isAdmin: function(){
		return this.attr("user") && this.attr("user").attr("isAdmin");
	}
});

/**
 * @constructor {can.List} bitballs/models/session.static.List List
 * @parent bitballs/models/session.static
 */
Session.List = can.List.extend({Map: Session},{});

var behaviors = [
	"constructor",
	"can/map",
	"constructor/store",
	"data/callbacks",
	"data/parse",
	"data/url",
	"constructor/callbacks-once"
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

var connection = connect( behaviors, options );

tag('session-model', connection);

module.exports = Session;
