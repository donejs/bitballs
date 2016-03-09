var Component = require("can/component/component");
var User = require("bitballs/models/user");
var Session = require("bitballs/models/session");

require("bootstrap/dist/css/bootstrap.css!");
require("can/map/define/");
require("can/route/");
require("can/view/href/");

exports.ViewModel = can.Map.extend({
  define: {
    user: {
      /**
       * user is used to bind to the form, so it must always be instanceof User
       */
      Value: User,

      /**
       * Sync user with session.user if session is active
       */
      get: function(val){
        if (this.attr('session.user')){
          //console.log('- existing user. Session: ' + this.attr('session').attr());
          return this.attr('session.user');
        }
        //console.log('- NEW user.');
        return val;
      }
    },
    session: {
      value: null
    }
  },
  createUserHandler: function(ev){
    ev.preventDefault();
    this.saveUser();
  },
  saveUser: function(){
    var self = this,
      isNew = this.attr("user").isNew()

    var promise = this.attr("user").save().then(function(user){

      // Clear password:
      user.attr("password", "");
      user.removeAttr("newPassword");

      if (!self.attr("session")){
        // Create session:
        self.attr("session", new Session({user: user}));

      } else {
        // Update session:
        self.attr("session").attr({user: user});
      }

      if(isNew){
        can.route.attr("page", "account");
      }
    });

    this.attr('savePromise', promise);

    return promise;
  }
});

exports.Component = Component.extend({
	tag: "user-create",
	template: require("./user.stache!"),
	viewModel: exports.ViewModel
});
