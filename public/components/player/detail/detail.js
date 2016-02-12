var can = require("can");
var Player = require("bitballs/models/player");
require("can/map/define/");


var DetailViewModel = can.Map.extend({
	define: {
		/**
		 * @property {Promise<bitballs/models/player>}
		 */
		playerPromise: {
			get: function(){
				var playerId = this.attr("playerId");
				if(playerId != null) {
					return Player.get({id: playerId});
				}
			}
		},
		/**
		 * @property {bitballs/models/player}
		 */
		player: {
			get: function(lastSet, resolve){
				var playerPromise = this.attr("playerPromise");
				if(playerPromise) {
					playerPromise.then(resolve);
				}
			}
		}
	}
	
	
});

can.Component.extend({
	tag: "player-detail",
	viewModel: DetailViewModel,
	template: require("./detail.stache!")
});


module.exports = DetailViewModel;