import { StacheDefineElement, type } from 'can';
import './create.less';
import view from './create.stache';
import Game from "~/models/game";
import Stat from "~/models/stat";


class StatCreate extends StacheDefineElement {
    static view = view;

    static define = {
        // EXTERNAL STATEFUL PROPERTIES
        time: Number,
        game: Game,

        // INTERNAL STATEFUL PROPERTIES
        statPlayerId: type.maybe(Number),
        statType: type.maybe(String)
    };

    connected(){

    }

    createStat(event){
        event.preventDefault();
        new Stat({
            gameId: this.game.id,
            playerId: this.statPlayerId,
            time: this.time || 0,
            type: this.statType
        }).save().then(() => {
            this.statPlayerId = this.statType = null;
        });
    }
    preventCreatingStat(){
        return !(this.statType && this.statPlayerId)
    }
}
customElements.define("stat-create",StatCreate);

export default StatCreate;
