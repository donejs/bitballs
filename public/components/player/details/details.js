import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './details.less';
import view from './details.stache';
import Stat from 'bitballs/models/stat'


export const ViewModel = DefineMap.extend({
  /**
  * @property {Promise<bitballs/models/stat.static.List>} bitballs/components/player/details.statPromise statsPromise
  * @parent bitballs/components/player/details.properties
  *
  * A promise that fetches a [bitballs/models/stat.static.List stat List] based on
  * [bitballs/components/player/details.ViewModel.prototype.playerId playerId].
  **/
  get statPromise() {
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
  stat: {
    get: function(lastSet, setVal){

      this.statPromise.then(setVal);
    }
  }
});

export default Component.extend({
  tag: 'player-details',
  ViewModel,
  view
});
