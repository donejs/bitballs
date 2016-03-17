import fixture from 'can-fixture';

export const players = {
	data: [{
		id: 1,
		name: 'Test Player',
		weight: 200,
		height: 71,
		birthday: '1980-01-01',
		profile:null,
		startRank:null
	}]
};

export const defineFixtures = function() {

	fixture('GET /services/players/{id}', function(req) {
		var data;
		players.data.forEach(function(player){
			if (player.id === parseInt(req.data.id, 10)) {
				data = player;
				return true;
			}
		});
		return data;
	});

	fixture('GET /services/players', function(req) {
		return players;
	});

	fixture('POST /services/players', function(request, response){
		if(!request.data.name){
			response(400, '{type: "Bad Request", message: "Can not create a player without a name"}');
		}else{
			response({
				"id":1
			});
		}
	});

	fixture('PUT /services/players/{id}', function(req) {
		req.data.id = parseInt(req.data.id, 10);
		return req.data;
	});
};

defineFixtures();

export default defineFixtures;
