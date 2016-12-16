exports.up = function(db, callback) {
  db.createTable('users', {
    id: { type: 'int', primaryKey: true, autoIncrement: true },
    name: 'string',
    password: { type: 'string', notNull: true },
    email: {type: 'string', unique: true},
    verificationHash: {
      type: "string",
      length: 100
    },
    verified: {
      type: "boolean",
      notNull: true,
      defaultValue: false
    },
    isAdmin: 'boolean'
  }, callback);
};

exports.down = function(db, callback) {
  db.dropTable('users', callback);
};
