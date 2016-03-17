var async = require('async');

exports.up = function(db, callback) {
  async.series([
    db.addColumn.bind(db, 'users', 'verified', {
      type: "boolean",
      notNull: true,
      defaultValue: false
    }),
    db.addColumn.bind(db, 'users', 'verificationHash', {
      type: "string",
      length: 100
    })
  ],
  callback);
};

exports.down = function(db, callback) {
  async.series([
    db.removeColumn.bind(db, 'users', 'verified' ),
    db.removeColumn.bind(db, 'users', 'verificationHash' )
  ],
  callback);
};
