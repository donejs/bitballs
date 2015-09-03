import fixture from 'can/util/fixture/';

fixture("/services/users", function(request, response){
	console.log('[fixture] request', request);
	response({
		email: request.data.email
	});
});