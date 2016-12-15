/**
 * @module {can-map} bitballs/models/session Session
 * @parent bitballs.clientModels
 *
 * @group bitballs/models/session.properties 0 properties
 */

var connect = require("can-connect");
var $ = require("jquery");
var DefineMap = require("can-define/map/map");
var DefineList = require("can-define/list/list");
var tag = require('can-connect/can/tag/');
var User = require("./user");


var Session = DefineMap.extend('Session', {
	/**
	 * @property {bitballs/models/user} bitballs/models/session.properties.user user
	 * @parent bitballs/models/session.properties
	 *
	 * The [bitballs/models/user] model this session represents.
	 **/
	user: User,
	/**
	 * @function
	 *
	 * Identifies whether or not the [bitballs/models/session.properties.user]
	 * property is an administrator.
	 *
	 * @return {Boolean}
	 **/
	isAdmin: function(){
		return this.user && this.user.isAdmin;
	}
});

/**
 * @constructor {can-list} bitballs/models/session.static.List List
 * @parent bitballs/models/session.static
 */
Session.List = DefineList.extend('SessionList', {"#": Session});

var behaviors = [
	require( "can-connect/constructor/" ),
	require( "can-connect/can/map/" ),
	require( "can-connect/constructor/store/" ),
	require( "can-connect/constructor/callbacks-once/" ),
	require( "can-connect/data/callbacks/" ),
	require( "can-connect/data/parse/" ),
	require( "can-connect/data/url/" )
];

var options = {
	ajax: $.ajax,
	Map: Session,
	List: Session.List,
	//name: "session",
	url: {
		getData: "/services/session",
		createData: "/services/session",
		destroyData: "/services/session",
		contentType: "application/x-www-form-urlencoded"
	}
};

Session.connection = connect( behaviors, options );

tag('session-model', Session.connection);

module.exports = Session;
