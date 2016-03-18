import QUnit from "steal-qunit";
import Game from './game';

QUnit.module('bitballs/models/game', {
    setup: function () {
        this.game = new Game();
    }
});

QUnit.test('Video url can be a YouTube url or key', function () {
    var game = this.game;
    var videoKey = '0zM3nApSvMg';

    var sampleUrls = [
        '0zM3nApSvMg',
        'http://www.youtube.com/v/0zM3nApSvMg?fs=1&hl=en_US&rel=0',
        'http://www.youtube.com/embed/0zM3nApSvMg?rel=0',
        'http://www.youtube.com/watch?v=0zM3nApSvMg&feature=feedrec_grec_index',
        'http://www.youtube.com/watch?v=0zM3nApSvMg',
        'http://youtu.be/0zM3nApSvMg',
        'http://www.youtube.com/watch?v=0zM3nApSvMg#t=0m10s',
        'http://www.youtube.com/user/IngridMichaelsonVEVO#p/a/u/1/0zM3nApSvMg',
        'http://youtu.be/0zM3nApSvMg',
        'http://www.youtube.com/embed/0zM3nApSvMg',
        'http://www.youtube.com/v/0zM3nApSvMg',
        'http://www.youtube.com/e/0zM3nApSvMg',
        'http://www.youtube.com/watch?v=0zM3nApSvMg',
        'http://www.youtube.com/?v=0zM3nApSvMg',
        'http://www.youtube.com/watch?feature=player_embedded&v=0zM3nApSvMg',
        'http://www.youtube.com/?feature=player_embedded&v=0zM3nApSvMg',
        'http://www.youtube.com/user/IngridMichaelsonVEVO#p/u/11/0zM3nApSvMg',
        'http://www.youtube-nocookie.com/v/0zM3nApSvMg?version=3&hl=en_US&rel=0'
    ];
    sampleUrls.forEach(function(url){
        game.attr('videoUrl', url);
        QUnit.equal(game.attr('videoUrl'), videoKey, 'Video key was extracted from input');
    });
});

QUnit.test('Rounds are not available if all their courts are assigned games', function () {
    var gameList = new Game.List();

    Game.courtNames.forEach(function (courtName) {
        gameList.push({
            round: Game.roundNames[0],
            court: courtName
        });
    });

    QUnit.equal(gameList.getAvailableRounds()[0], Game.roundNames[1],
        'The first round is not available');
});

QUnit.test('Courts are not available if they are assigned games', function () {
    var gameList = new Game.List([{
        round: Game.roundNames[0],
        court: Game.courtNames[0]
    }]);

    QUnit.equal(gameList.getAvailableCourts(Game.roundNames[0])[0], Game.courtNames[1],
        'The first round is not available');
});

