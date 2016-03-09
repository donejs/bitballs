var Component = require("can/component/component");
var Map = require("can/map/");
var Team = require("bitballs/models/team");
var Game = require("bitballs/models/game/");
var Player = require("bitballs/models/player");
var Tournament = require("bitballs/models/tournament/");

require("bootstrap/dist/css/bootstrap.css!");
require("can/map/define/");
require("can/route/");
require("can/view/href/");

exports.ViewModel = Map.extend({
  define: {
    tournament: {
      Type: Tournament,
      Value: Tournament
    }
  },
  createTournament: function(ev){
    ev && ev.preventDefault();
    var self = this;

    var promise = this.attr("tournament").save().then(function(player){
      self.attr("tournament", new Tournament());
    });
    
    this.attr("savePromise", promise);

    return promise;
  }
});

exports.Component = Component.extend({
	tag: "tournament-list",
	template: require("./list.stache!"),
	viewModel: exports.ViewModel,
	leakScope: false
});
