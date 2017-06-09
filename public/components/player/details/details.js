import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './details.less';
import view from './details.stache';
import Game from 'bitballs/models/game';
import Player from 'bitballs/models/player';
import Stat from 'bitballs/models/stat';
import Tournament from 'bitballs/models/tournament';

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
  * @property {Promise<bitballs/models/tournament.static.List>} bitballs/components/player/details.tournamentPromise tournamentsPromise
  * @parent bitballs/components/player/details.properties
  *
  * A promise that fetches a [bitballs/models/tournament.static.List tournament List] based on
  * [bitballs/components/player/details.ViewModel.prototype.playerId playerId].
  **/
  get tournamentsPromise() {
    return Tournament.getList();
  },
  /**
  * @property {bitballs/models/tournament.static.List} bitballs/components/player/details.tournament tournament
  * @parent bitballs/components/player/details.properties
  *
  * A [bitballs/models/tournament.static.List tournament List] instance.
  **/
  tournaments: {
    get: function(lastSet, setVal){
      this.tournamentsPromise.then(setVal);
    }
  },
  /**
  * @property {Promise<bitballs/models/game.static.List>} bitballs/components/player/details.gamePromise gamesPromise
  * @parent bitballs/components/player/details.properties
  *
  * A promise that fetches a [bitballs/models/game.static.List game List] based on
  * [bitballs/components/player/details.ViewModel.prototype.playerId playerId].
  **/
  get gamesPromise() {
    return Game.getList();
  },
  /**
  * @property {bitballs/models/game.static.List} bitballs/components/player/details.game game
  * @parent bitballs/components/player/details.properties
  *
  * A [bitballs/models/game.static.List game List] instance.
  **/
  games: {
    get: function(lastSet, setVal){
      this.gamesPromise.then(setVal);
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

  get statsByTournament() {
    if (!this.games || !this.stats) {
        return null;
    }

    let mapGamesToTournaments = {};
    this.games.forEach(({ id, tournamentId }) => {
      mapGamesToTournaments[id] = tournamentId;
    });

    let statsByTournament = {};
    this.stats.forEach((stat) => {
      let tournamentId = mapGamesToTournaments[stat.gameId];
      if(tournamentId){
        if (!statsByTournament[tournamentId]) {
          statsByTournament[tournamentId] = new Stat.List();
        }

        statsByTournament[tournamentId].push(stat);
      }
    });

    return statsByTournament;
  },
});

export default Component.extend({
  tag: 'player-details',
  ViewModel,
  view
});
