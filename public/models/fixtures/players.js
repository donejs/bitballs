import fixture from 'can/util/fixture/';

fixture('GET services/players', function(){
	return {
		"data":[
			{
				"name": "Test Player",
				"weight": 200,
				"height": 71,
				"birthday": "1980-01-01",
				"id":1,
				"profile":null,"startRank":null
			}
		]
	}
});

fixture('GET services/players/{id}', function(request, response){
	if(request.data.id == '1'){
		console.log('hi')
		response({
			"name": "Test Player",
			"weight": 200,
			"height": 71,
			"birthday": "1980-01-01",
			"id":1,
			"profile":null,"startRank":null
		});
	}else if(!request.data.id){
		response({
			data:[{
				"name": "Test Player",
				"weight": 200,
				"height": 71,
				"birthday": "1980-01-01",
				"id":1,
				"profile":null,"startRank":null
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
