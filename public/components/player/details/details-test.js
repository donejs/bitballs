import QUnit from 'steal-qunit';
import F from 'funcunit';
import {ViewModel} from './details';
import fixture from 'can-fixture';

F.attach(QUnit);

// ViewModel unit tests
QUnit.module('bitballs/components/player/details', {
    beforeEach: function(){
        localStorage.clear();
    }
});

// Make sure we properly map stats to game ID's
QUnit.test('should map stats to game ID', function (assert) {
    const GAME_ID = 40;
    const STATS = [{"id":3,"gameId":1,"playerId":3,"type":"1PA","time":43,"value":null},{"id":7,"gameId":1,"playerId":3,"type":"To","time":97,"value":null},{"id":27,"gameId":1,"playerId":3,"type":"2P","time":449,"value":null},{"id":37,"gameId":1,"playerId":3,"type":"1PA","time":723,"value":null},{"id":48,"gameId":1,"playerId":3,"type":"1PA","time":908,"value":null},{"id":53,"gameId":1,"playerId":3,"type":"1P","time":1066,"value":null},{"id":58,"gameId":1,"playerId":3,"type":"1PA","time":1175,"value":null},{"id":490,"gameId":15,"playerId":3,"type":"1PA","time":74,"value":null},{"id":526,"gameId":15,"playerId":3,"type":"DRB","time":378,"value":null},{"id":539,"gameId":15,"playerId":3,"type":"DRB","time":512,"value":null},{"id":540,"gameId":15,"playerId":3,"type":"1PA","time":519,"value":null},{"id":557,"gameId":15,"playerId":3,"type":"ORB","time":629,"value":null},{"id":561,"gameId":15,"playerId":3,"type":"DRB","time":640,"value":null},{"id":566,"gameId":15,"playerId":3,"type":"ORB","time":702,"value":null},{"id":567,"gameId":15,"playerId":3,"type":"Ast","time":706,"value":null},{"id":570,"gameId":15,"playerId":3,"type":"Ast","time":744,"value":null},{"id":583,"gameId":15,"playerId":3,"type":"ORB","time":810,"value":null},{"id":584,"gameId":15,"playerId":3,"type":"1PA","time":811,"value":null},{"id":936,"gameId":20,"playerId":3,"type":"DRB","time":318,"value":null},{"id":951,"gameId":20,"playerId":3,"type":"DRB","time":402,"value":null},{"id":953,"gameId":20,"playerId":3,"type":"1P","time":409,"value":null},{"id":1148,"gameId":23,"playerId":3,"type":"DRB","time":8,"value":null},{"id":1153,"gameId":23,"playerId":3,"type":"DRB","time":63,"value":null},{"id":1158,"gameId":23,"playerId":3,"type":"DRB","time":85,"value":null},{"id":1159,"gameId":23,"playerId":3,"type":"1P","time":88,"value":null},{"id":1192,"gameId":23,"playerId":3,"type":"1PA","time":343,"value":null},{"id":1195,"gameId":23,"playerId":3,"type":"DRB","time":351,"value":null},{"id":1202,"gameId":23,"playerId":3,"type":"1P","time":397,"value":null},{"id":1920,"gameId":35,"playerId":3,"type":"DRB","time":150,"value":null},{"id":1945,"gameId":35,"playerId":3,"type":"DRB","time":389,"value":null},{"id":1947,"gameId":35,"playerId":3,"type":"ORB","time":399,"value":null},{"id":1949,"gameId":35,"playerId":3,"type":"ORB","time":406,"value":null},{"id":1956,"gameId":35,"playerId":3,"type":"DRB","time":471,"value":null},{"id":1961,"gameId":35,"playerId":3,"type":"2PA","time":488,"value":null},{"id":1964,"gameId":35,"playerId":3,"type":"DRB","time":499,"value":null},{"id":1971,"gameId":35,"playerId":3,"type":"1P","time":571,"value":null},{"id":2283,"gameId":38,"playerId":3,"type":"1PA","time":61,"value":null},{"id":2291,"gameId":38,"playerId":3,"type":"1PA","time":108,"value":null},{"id":2304,"gameId":38,"playerId":3,"type":"DRB","time":246,"value":null},{"id":2308,"gameId":38,"playerId":3,"type":"DRB","time":266,"value":null},{"id":2310,"gameId":38,"playerId":3,"type":"ORB","time":277,"value":null},{"id":2311,"gameId":38,"playerId":3,"type":"1P","time":279,"value":null},{"id":2330,"gameId":38,"playerId":3,"type":"2PA","time":442,"value":null},{"id":2336,"gameId":38,"playerId":3,"type":"Blk","time":489,"value":null},{"id":2341,"gameId":38,"playerId":3,"type":"ORB","time":590,"value":null},{"id":2343,"gameId":38,"playerId":3,"type":"2P","time":596,"value":null},{"id":2346,"gameId":38,"playerId":3,"type":"1PA","time":625,"value":null},{"id":2350,"gameId":38,"playerId":3,"type":"ORB","time":652,"value":null},{"id":2373,"gameId":38,"playerId":3,"type":"DRB","time":842,"value":null},{"id":2377,"gameId":38,"playerId":3,"type":"2PA","time":894,"value":null},{"id":2385,"gameId":38,"playerId":3,"type":"To","time":954,"value":null},{"id":2639,"gameId":40,"playerId":3,"type":"1PA","time":42,"value":null}];
    const WANTED_STATS = STATS.filter(({gameId}) => gameId === GAME_ID);

    fixture({
        'GET /services/games': {
            "data":[
                {
                    "id": GAME_ID,
                    "tournamentId":1,
                    "round":"Semi Finals",
                    "court":"2",
                    "videoUrl":"is2Z6JU6nGg",
                    "homeTeamId":18,
                    "awayTeamId":2
                },
            ]
        },
        'GET /services/stats': {
            "data": STATS
        },
    });

    let done = assert.async();
    let vm = new ViewModel({
        playerId: '1'
    });

    vm.on('statsByTournament', function(e, val){
        assert.deepEqual(val[1].serialize(), WANTED_STATS);
        done();
    });
});
