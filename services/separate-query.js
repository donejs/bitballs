var fetchKeys = [ 'require', 'columns', 'transacting', 'withRelated' ];

module.exports = function(input) {
	var output = {
		query: {},
		fetch: {},
	};

	for (var key in input) {
		if (fetchKeys.includes(key)) {
			output.fetch[key] = input[key];
		}
		else {
			output.query[key] = input[key];
		}
	}

	return output;
};
