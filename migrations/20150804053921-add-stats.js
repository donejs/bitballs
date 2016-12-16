var async = require('async');

exports.up = function(db, callback) {
 async.series([
 	db.createTable.bind(db, 'tournaments', {
      id: { type: 'int', primaryKey: true, autoIncrement: true },
      date: { type: 'date', notNull: true },
    }),
    db.createTable.bind(db, 'teams', {
      id: { type: 'int', primaryKey: true, autoIncrement: true },
      tournamentId: 'int',
      name: 'string',
      color: 'string',
      player1Id: 'int',
      player2Id: 'int',
      player3Id: 'int',
      player4Id: 'int'
    }),
    db.createTable.bind(db, 'games', {
      id: { type: 'int', primaryKey: true, autoIncrement: true },
      tournamentId: 'int',
      round: 'string',
      court: 'string',
      videoUrl: 'string',
      homeTeamId: 'int',
      awayTeamId: 'int'
    }),
    db.createTable.bind(db, 'stats', {
      id: { type: 'int', primaryKey: true, autoIncrement: true },
      gameId: 'int',
      playerId: 'int',
      time: { type: 'int' },
      value: {type: 'int'},
      type: 'string'
    })
  ], callback);
};

exports.down = function(db, callback) {
  async.series([
    db.dropTable.bind(db, 'tournaments'),
    db.dropTable.bind(db, 'teams'),
    db.dropTable.bind(db, 'games'),
    db.dropTable.bind(db, 'stats')
  ], callback);
};
