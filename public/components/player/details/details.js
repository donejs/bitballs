import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './details.less';
import view from './details.stache';
import Stat from 'bitballs/models/stat';
import Player from 'bitballs/models/player';

export const ViewModel = DefineMap.extend({
  /**
  * @property {Promise<bitballs/models/player>} bitballs/components/player/details.playerPromise playerPromise
  * @parent bitballs/components/player/details.properties
  *
  * A promise that fetches a [bitballs/models/player player] based on
  * [bitballs/components/player/details.ViewModel.prototype.playerId playerId].
  **/
  get playerPromise() {
    return Player.get(this.playerId);
  },
  /**
  * @property {bitballs/models/player} bitballs/components/player/details.player player
  * @parent bitballs/components/player/details.properties
  *
  * A [bitballs/models/player player] instance.
  **/
  player: {
    get: function(lastSet, setVal){
      this.playerPromise.then(setVal);
    }
  },
  /**
  * @property {Promise<bitballs/models/stat.static.List>} bitballs/components/player/details.statPromise statsPromise
  * @parent bitballs/components/player/details.properties
  *
  * A promise that fetches a [bitballs/models/stat.static.List stat List] based on
  * [bitballs/components/player/details.ViewModel.prototype.playerId playerId].
  **/
  get statsPromise() {
    return Stat.getList({
      where: {playerId: this.playerId}
    });
  },
  /**
  * @property {bitballs/models/stat.static.List} bitballs/components/player/details.stat stat
  * @parent bitballs/components/player/details.properties
  *
  * A [bitballs/models/stat.static.List stat List] instance.
  **/
  stats: {
    get: function(lastSet, setVal){
      this.statsPromise.then(setVal);
    }
  },
});

export default Component.extend({
  tag: 'player-details',
  ViewModel,
  view
});
