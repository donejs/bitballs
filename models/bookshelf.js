var connectionString = process.env.DATABASE_URL || process.env.HEROKU_POSTGRESQL_TEAL_URL || 'postgres://localhost:5432/bitballs';

var knex = require('knex')({
  client: 'pg',
  connection: connectionString
});

module.exports = require('bookshelf')(knex);