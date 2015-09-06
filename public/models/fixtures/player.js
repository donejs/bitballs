import fixture from 'can/util/fixture/';

can.fixture({
	"/services/players": function () {
		return {
			"data":[
				{"id":1,"name":"Joe Bobo","weight":175,"height":72,"birthday":"1982-12-26T06:00:00.000Z","profile":null,"startRank":null}
			]
		};
	}
});
