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

var Component = require("can/component/component"),
	User = require("bitballs/models/user"),
	Session = require("bitballs/models/session"),
	CanMap = require("can/map/"),
	route = require("can/route/");

require("bootstrap/dist/css/bootstrap.css!");
require("can/map/define/");
require("can/route/");

/**
 * @constructor bitballs/components/user/details.ViewModel ViewModel
 * @parent bitballs/components/user/details
 *
 * @description  A `<user-details>` component's viewModel.
 */

exports.ViewModel = CanMap.extend(
/**
 * @prototype
 */
{
	define: {
		/**
		 * @property {can.Map}
		 *
		 * Provides a user instance. If a session is active, this
		 * syncs the user with `session.user`. Otherwise, a user instance
		 * is created since this property is used to bind with the user details form.
		 *
		 */
		user: {
			Value: User,
			get: function(val) {
				if (this.attr('session.user')) {
					return this.attr('session.user');
				}
				return val;
			}
		},
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
			value: null
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
		userStatus: {
			get: function() {
				if (this.attr("user").isNew()) {
                    return "new";
                }
				if (!this.attr("user.verified")) {
                    return "pending";
                }
				return "verified";
			}
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
        if(ev) {
            ev.preventDefault();
        }
		var self = this,
			isNew = this.attr("user").isNew(),
			promise = this.attr("user").save().then(function(user) {

				user.attr({
					password: "",
					verificationHash: ""
				});
				user.removeAttr("newPassword");

				if (!self.attr("session")) {
					// Create session:
					self.attr("session", new Session({
						user: user
					}));
				} else {
					// Update session:
					self.attr("session").attr({
						user: user
					});
				}

				if (isNew) {
					route.attr("page", "account");
				}
			});

		this.attr('savePromise', promise);

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
			this.attr("user").destroy(function() {
				self.attr("session").destroy();
				self.attr("session", null);
				route.attr("page", "register");
			});
		}
	}
});

exports.Component = Component.extend({
	tag: "user-details",
	template: require("./details.stache!"),
	viewModel: exports.ViewModel
});
