var fetchKeys = [ 'require', 'columns', 'transacting', 'withRelated' ];

module.exports = function(input) {
	var output = {
		query: {},
		fetch: {},
	};

	for (var key in input) {
		if (fetchKeys.indexOf(key) >= 0) {
			output.fetch[key] = input[key];
		}
		else {
			output.query[key] = input[key];
		}
	}

	return output;
};
