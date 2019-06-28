import { StacheDefineElement, type } from 'can';
import './create.less';
import view from './create.stache';
import Game from "~/models/game";
import Stat from "~/models/stat";
import "bootstrap/dist/css/bootstrap.css";


class StatCreate extends StacheDefineElement {
    static view = view;

    static define = {
        // EXTERNAL STATEFUL PROPERTIES
        time: type.convert(Number),
        game: Game,

        // INTERNAL STATEFUL PROPERTIES
        statPlayerId: type.maybe(Number),
        statType: type.maybe(String)
    };

    connected(){
    }
    /**
	 * @function
	 * @description Adds time to the current stat.
	 * @param {Number} time How much to increment the time by.
	 *
	 * @body
	 * Use in a template like:
	 * ```
	 * <div class="col-xs-6">
	 *   <a class="btn btn-default" ($click)="minusTime(10)">-10 s</a>
	 *   <a class="btn btn-default" ($click)="minusTime(2)">-2 s</a>
	 *   <a class="btn btn-default" ($click)="addTime(2)">+2 s</a>
	 *   <a class="btn btn-default" ($click)="addTime(10)">+10 s</a>
	 * </div>
	 * ```
	 */
	addTime(time){
        this.time = this.time + time;
		// this.youtubePlayer.seekTo(this.youtubePlayer.getCurrentTime() + time, true);
	}
	/**
	 * @function
	 * @description Subtracts time from the current stat.
	 * @param {Number} time How much to decrement the time by.
	 *
	 * @body
	 * Use in a template like:
	 * ```
	 * <div class="col-xs-6">
	 *   <a class="btn btn-default" ($click)="minusTime(10)">-10 s</a>
	 *   <a class="btn btn-default" ($click)="minusTime(2)">-2 s</a>
	 *   <a class="btn btn-default" ($click)="addTime(2)">+2 s</a>
	 *   <a class="btn btn-default" ($click)="addTime(10)">+10 s</a>
	 * </div>
	 * ```
	 */
	minusTime(time){
        this.time = this.time - time;
		// this.youtubePlayer.seekTo(this.youtubePlayer.getCurrentTime() - time, true);
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
    floor(number) {
        return Math.floor(number)
    }
}

customElements.define("stat-create", StatCreate);

export default StatCreate;
