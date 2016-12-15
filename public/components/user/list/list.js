/**
 * @module {Module} bitballs/components/user/list <user-list>
 * @parent bitballs.components
 *
 * @description  Provides a custom element that allows an admin user
 * to view the list of registered users, see whether they have
 * verified their email addresses, and change their admin status.
 *
 * @signature `<user-list {session}/>`
 *   Creates the user list.
 *
 *  @param {bitballs/model/session} session The session object. Contains information
 *  about the logged in user. If the logged in user is not an administrator, they
 *  will not be able to view the user list. This also allows the component to prevent
 *  the logged in user from removing themseves as an administrator.
 *
 * @body
 *
 * To create a `<user-list>` element, pass the [bitballs/model/session] like:
 *
 * ```
 * <user-list
 * 		{session}="session"
 * 		></user-list>
 * ```
 *
 * ## Example
 *
 * @demo public/components/user/list/list.html
 */

import Component from 'can-component';
import DefineMap from 'can-define/map/map';
import './list.less!';
import template from './list.stache!';
import User from "bitballs/models/user";
import Session from "bitballs/models/session";

/**
 * @constructor bitballs/components/user/list.ViewModel ViewModel
 * @parent bitballs/components/user/list
 *
 * @description A `<user-list>` component's ViewModel.
 */

export const ViewModel = DefineMap.extend({
	/**
	 * @property {bitballs/models/session} session
	 *   The session object if a user is logged in. The user must be an admin to view the user list.
	 */
	session: Session,
	/**
	 * @property {can-list<bitballs/models/user>}
	 *
	 * Provides list of users, like:
	 *
	 *   {data: [{
	 *   	"id": Int,
	 *   	"email": String,
	 *   	"isAdmin": Boolean,
	 *   	"verified": Boolean
	 *   }, ...]}
	 *
	 */
	users: {
		get: function(list) {
			if (list) {
        		return list;
      		}
			return User.getList({});
		}
	},
	/**
	 * @function
	 *
	 * Sets the user's admin status.
	 *
	 * @param {bitballs/models/user} user The user object that will be set or unset as an admin.
	 * @param {Boolean} isAdmin Whether the user should be set as an admin.
	 *
	 * @return {Promise<bitballs/models/user} The save promise that resolves to a user.
	 */
	setAdmin: function(user, isAdmin) {
		user.isAdmin = isAdmin;
		return user.save();
	}
});

export default Component.extend({
	tag: 'user-list',
	ViewModel: ViewModel,
	view: template
});
