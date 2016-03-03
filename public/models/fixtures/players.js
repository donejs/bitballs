import fixture from 'can/util/fixture/';

fixture('GET services/players/{id}', function(request, response){
	if(request.data.id == '1'){
		response({
			"name": "Test Player",
			"weight": 200,
			"height": 71,
			"birthday": "1980-01-01",
			"id":1
		});
	}else if(!request.data.id){
		response({
			data:[{
				"name": "Test Player",
				"weight": 200,
				"height": 71,
				"birthday": "1980-01-01",
				"id":1
			}]
		});
	}
});

fixture('POST services/players', function(request, response){
	if(!request.data.name){
		response(400, '{type: "Bad Request", message: "Can not create a player without a name"}');
	}else{
		response({
			"id":1
		});
	}
});

fixture('PUT services/players/{id}', function(request, response){
	request.data.id = parseInt(request.data.id);
	response(request.data);
});
