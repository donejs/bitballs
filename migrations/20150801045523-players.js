exports.up = function(db, callback) {
  db.createTable('players', {
    id: { type: 'int', primaryKey: true, autoIncrement: true },
    name: 'string',
    weight: 'int',
    height: 'int',
    birthday: 'date',
    profile: 'text',
    startRank: 'string'
  }, callback);
};

exports.down = function(db, callback) {
  db.dropTable('players', callback);
};
