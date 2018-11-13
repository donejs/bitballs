/**
 * @module {Module} bitballs/components/user/details <user-details>
 * @parent bitballs.components
 *
 * @description Provides a custom element that allows a user to
 * register, to view account verification status, and to
 * update their password.
 *
 * @signature `<user-details {session}/>`
 *   Creates the user details form.
 *
 *  @param {bitballs/model/session} session The session object. If a user is
 *  currently logged in, contains data about that user.
 *
 *
 * @body
 *
 * To create a `<user-details>` element,  pass the [bitballs/model/session] like:
 *
 * ```
 * <user-details
 *     {session}="session"
 *     ></user-details>
 * ```
 *
 * ## Example
 *
 * @demo public/components/user/details/details.html
 */

import { Component, DefineMap, route } from "can";
import User from "bitballs/models/user";
import Session from "bitballs/models/session";
import "bootstrap/dist/css/bootstrap.css";
import view from "./details.stache!";

/**
 * @constructor bitballs/components/user/details.ViewModel ViewModel
 * @parent bitballs/components/user/details
 *
 * @description  A `<user-details>` component's viewModel.
 */

export const ViewModel = DefineMap.extend({
	/**
	 * @property {bitballs/models/session|null}
	 *
	 * If a user is logged in, the session data, including
	 * data about the currently logged in user.
	 *
	 * @signature `bitballs/models/session`
	 *
	 * 	A session instance, which includes data about the logged in user like:
	 *
	 *      {
	 *      	user: {
	 *      		email: "tomrobbins@tommyrotten.net",
	 *      		id: 4,
	 *      		verified: false,
	 *      		isAdmin: false
	 *      	}
	 *      }
	 *
	 * @signature `null`
	 *
	 * 	If the user is not currently logged in, `null`.
	 */
	session: {
		default: null
	},
	/**
	* @property {Promise} bitballs/components/user/details.savePromise savePromise
	* @parent bitballs/components/users/details.properties
	*
	* The promise that resolves when the user is saved
	*/
	savePromise: 'any',
	/**
	 * @property {can-define}
	 *
	 * Provides a user instance. If a session is active, this
	 * syncs the user with `session.user`. Otherwise, a user instance
	 * is created since this property is used to bind with the user details form.
	 *
	 */
	user: {
		Default: User,
		get: function(val) {
			if (this.session) {
				return this.session.user;
			}
			return val;
		}
	},
  /**
   * @property {String}
   *
   * The status of the user. One of the following:
   *
   *  - "new": user has not been created
   *  - "pending": user has been created, but has not verified their email address
   *  - "verified": user has verified their email address
   *
   *  With a new user, the component shows a registration form.
   *  With a pending user, the component shows the email address.
   *  With a verified user, the component shows a form allowing the user to change their password.
   */
  get userStatus() {
    if (this.user.isNew()) {
      return "new";
    }
    if (!this.user.verified) {
      return "pending";
    }
    return "verified";
  },
  /**
   * @property {Boolean}
   *
   * Whether the user has not been created yet.
   */
  isNewUser: {
    get: function get() {
      return this.user.isNew();
    }
  },
	/**
	 * @function saveUser
	 *
	 * If the user is being created, creates a new user and when successful:
	 * 	- Creates a new session
	 * 	- Logs the new user in
	 * 	- Changes the page route from "register" to "account"
	 *
	 * If the user's password is being updated, updates the password and
	 * when successful, clears the form.
	 *
	 * @return {Promise<>} A promise that allows the component to display errors, if any.
	 *
	 */
	saveUser: function(ev) {
    if(ev) { ev.preventDefault(); }
		var self = this,
			isNew = this.user.isNew(),
			promise = this.user.save().then(function(user) {
				user.password = "";
				user.verificationHash = "";
				user.newPassword = null;

				if (!self.session) {
					self.session = new Session({
						user: user
					});
				} else {
					self.session.user = user;
				}
				if (isNew) {
					route.page = "account";
				}
			});
		this.savePromise = promise;
		return promise;
	},
  /**
	 * @function deleteUser
	 *
	 * Confirms that the user would like to delete his or her account, then
	 * destroys the user and when successful:
	 * 	- Logs the user out, destroying the current session
	 * 	- Changes the page route from "account" to "register"
	 */
	deleteUser: function() {
		var self = this;
		if (confirm('Are you sure you want to delete your account?')) {
			this.user.destroy(function() {
				self.session.destroy();
				self.session = null;
				route.page = "register";
			});
		}
	}
});

export const UserDetails = Component.extend({
	tag: "user-details",
	view,
	ViewModel
});

export { UserDetails as Component };
