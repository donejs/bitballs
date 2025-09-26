var async = require('async');

exports.up = function(db, callback) {
	async.series([
		db.addColumn.bind(db, "stats","creatorId",{type: 'int'})
	], callback);
};

exports.down = function(db, callback) {
	async.series([
		db.removeColumn.bind(db, "stats","creatorId")
	], callback);
};
