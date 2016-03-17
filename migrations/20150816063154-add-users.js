exports.up = function(db, callback) {
  db.createTable('users', {
    id: { type: 'int', primaryKey: true, autoIncrement: true },
    name: 'string',
    password: 'string',
    email: {type: 'string', unique: true},
    isAdmin: 'boolean'
  }, callback);
};

exports.down = function(db, callback) {
  db.dropTable('users', callback);
};
