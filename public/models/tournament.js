/**
 * @module {can-map} bitballs/models/tournament Tournament
 * @parent bitballs.clientModels
 *
 * @group bitballs/models/tournament.properties 0 properties
 */
import {
	superModel, QueryLogic, DefineMap, DefineList
} from "can";
import bookshelfService from "./bookshelf-service";
import moment from "moment";


var Tournament = DefineMap.extend('Tournament', {
	/**
	 * @property {Number} bitballs/models/tournament.properties.id id
	 * @parent bitballs/models/tournament.properties
	 *
	 * A unique identifier.
	 **/
	id: {type: 'number', identity: true},
	/**
	 * @property {String} bitballs/models/tournament.properties.date date
	 * @parent bitballs/models/tournament.properties
	 *
	 * The date that the tournament is schedule to occur.
	 **/
	date: 'string',
	/**
	 * @property {Date} bitballs/models/tournament.properties.jsDate jsDate
	 * @parent bitballs/models/tournament.properties
	 *
	 * The [bitballs/models/tournament.properties.date] converted to a
	 * JavaScript Date object.
	 **/
	get jsDate() {
		return moment(this.date).toDate() || null;
	},
	/**
	 * @property {Date} bitballs/models/tournament.properties.year year
	 * @parent bitballs/models/tournament.properties
	 *
	 * The year referred to by [bitballs/models/tournament.properties.jsDate].
	 **/
	get year() {
		var jsDate = this.jsDate;
		return jsDate ? jsDate.getFullYear() : null;
	},
	/**
	 * @property {Date} bitballs/models/tournament.properties.prettyDate prettyDate
	 * @parent bitballs/models/tournament.properties
	 *
	 * A formatted output of [bitballs/models/tournament.properties.date].
	 **/
	get prettyDate() {
		var date = new Date(this.date);
		return isNaN(date) ? null : date;
	}
});

/**
 * @constructor {can-list} bitballs/models/tournament.static.List List
 * @parent bitballs/models/tournament.static
 */
Tournament.List = DefineList.extend('TournamentList', {"#": Tournament});


Tournament.connection = superModel({
	Map: Tournament,
	List: Tournament.List,
	url: {
		resource: "/services/tournaments",
		contentType: "application/x-www-form-urlencoded"
	},
	name: "tournament",
	queryLogic: new QueryLogic(Tournament, bookshelfService),
	updateInstanceWithAssignDeep: true
});

export default Tournament;
