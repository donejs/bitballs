var dbm = global.dbm || require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
  db.createTable('users', {
    id: { type: 'int', primaryKey: true, autoIncrement: true },
    name: 'string',
    password: { type: 'string', nullable: false},
    email: {type: 'string', unique: true, nullable: false},
    isAdmin: 'boolean'
  }, callback);
};

exports.down = function(db, callback) {
  db.dropTable('users', callback);
};
