var dbm = global.dbm || require('db-migrate');
var type = dbm.dataType;
var async = require('async');

exports.up = function(db, callback) {
    async.series([
        db.runSql.bind(db, 'ALTER TABLE games ALTER COLUMN "homeTeamId" TYPE integer USING "homeTeamId"::numeric'),
        db.runSql.bind(db, 'ALTER TABLE games ALTER COLUMN "awayTeamId" TYPE integer USING "awayTeamId"::numeric')
    ],
    callback);
};

exports.down = function(db, callback) {
    async.series([
        db.changeColumn.bind(db, 'games', 'homeTeamId', {
            type: 'string'
        }),
        db.changeColumn.bind(db, 'games', 'awayTeamId', {
            type: 'string'
        })
    ],
    callback);
};
