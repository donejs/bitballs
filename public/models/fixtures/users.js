import fixture from 'can-fixture';

fixture("POST /services/users", function(request, response){
	console.log('[fixture] request', request);

	if(!request.data.password){
		response(400, '{type: "Bad Request", message: "Can not create a user without a password"}');
	}else{
		response({
			id: 123,
			email: request.data.email
		});
	}
});

fixture("PUT /services/users/{id}", function(request, response){
	if(!request.data.password){
		response(400, '{type: "Bad Request", message: "Can not create a user without a password"}');
	}else{
		response({
			id: request.data.id,
			email: request.data.email
		});
	}
});
