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
    },
    userStatus: {
      get: function () {
        if ( this.attr( "user" ).isNew() ) return "new";
        if ( !this.attr( "user.verified" ) ) return "pending";
        return "verified";
      }
    }
  },
  createUserHandler: function(ev){
    ev.preventDefault();
    this.saveUser();
  },
  saveUser: function(){
    var self = this;
    var isNew = this.attr("user").isNew();
    var promise = this.attr("user").save().then(function(user){

      user.attr({
        password: "",
        verificationHash: ""
      });
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
  },
  deleteUser: function () {
    var self = this;
    if ( confirm( "Are you sure you want to delete your account?" ) ) {
      this.attr("user").destroy(function () {
        self.attr("session").destroy();
        self.attr("session", null);
        can.route.attr("page", "register");
      });
    }
  }
});

exports.Component = Component.extend({
	tag: "bitballs-user",
	template: require("./user.stache!"),
	viewModel: exports.ViewModel
});
