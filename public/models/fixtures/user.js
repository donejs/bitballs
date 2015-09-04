import fixture from 'can/util/fixture/';

fixture("/services/users", function(request, response){
	console.log('[fixture] request', request);
	response({
		id: 123,
		email: request.data.email
	});
});

fixture("/services/users/:id", function(request, response){
	console.log('[fixture] request', request);
	response({
		id: 123,
		email: request.data.email
	});
});