var async = require('async');

exports.up = function(db, callback) {
	async.series([
		db.changeColumn.bind(db, 'players', 'name', {
			notNull: true
		}),
		db.changeColumn.bind(db, 'users', 'password', {
			notNull: true
		}),
		db.changeColumn.bind(db, 'tournaments', 'date', {
			notNull: true
		})
	],
	callback);
};

exports.down = function(db, callback) {
	async.series([
		db.changeColumn.bind(db, 'players', 'name', {
			notNull: false
		}),
		db.changeColumn.bind(db, 'users', 'password', {
			notNull: false
		}),
		db.changeColumn.bind(db, 'tournaments', 'date', {
			notNull: false
		})
	],
	callback);
};
