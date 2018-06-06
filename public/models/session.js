/**
 * @module {can-map} bitballs/models/session Session
 * @parent bitballs.clientModels
 *
 * @group bitballs/models/session.properties 0 properties
 */

var restModel = require('can-rest-model');
var QueryLogic = require("can-query-logic");
var bookshelfService = require("./bookshelf-service").default;
var $ = require("jquery");
var DefineMap = require("can-define/map/map");
var DefineList = require("can-define/list/list");
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


Session.connection = restModel({
	ajax: $.ajax,
	Map: Session,
	List: Session.List,
	//name: "session",
	url: {
		getData: "/services/session",
		createData: "/services/session",
		destroyData: "/services/session",
		contentType: "application/x-www-form-urlencoded"
	},
	queryLogic: new QueryLogic(Session, bookshelfService),
	updateInstanceWithAssignDeep: true
});

module.exports = Session;
