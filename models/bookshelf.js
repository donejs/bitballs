var dbConfig = require('../database.json');
var environmentKey = process.env.NODE_ENV === 'production' ? 'prod' : 'dev';
var dbEnvironmentConfig = dbConfig[environmentKey];

// Use the string itself or use the provided environment variable
var connectionString = typeof dbEnvironmentConfig === 'string' ?
    dbEnvironmentConfig :
    process.env[dbEnvironmentConfig.ENV];

console.log("GUESSED CONNECTION", connectionString,environmentKey );
connectionString = process.env.DATABASE_URL || process.env.HEROKU_POSTGRESQL_TEAL_URL || 'postgres://localhost:5432/bitballs';
console.log("resulting CONNECTION", connectionString);

var knex = require('knex')({
  client: 'pg',
  connection: connectionString
});

module.exports = require('bookshelf')(knex);
