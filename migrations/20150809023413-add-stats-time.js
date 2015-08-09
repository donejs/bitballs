var dbm = global.dbm || require('db-migrate');
var type = dbm.dataType;
var async = require('async');

exports.up = function(db, callback) {
	async.series([
		db.addColumn.bind(db, "stats","time",{type: 'int'}),
		db.addColumn.bind(db, "stats","value",{type: 'int'})
	], callback);
};

exports.down = function(db, callback) {
	async.series([
		db.removeColumn.bind(db, "stats","time"),
		db.addCremoveColumnolumn.bind(db, "stats","value")
	], callback);
};
