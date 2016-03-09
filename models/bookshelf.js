var dbConfig = require('../database.json');
var environmentKey = process.env.NODE_ENV === 'production' ? 'prod' : 'dev';
var dbEnvironmentConfig = dbConfig[environmentKey];

// Use the string itself or use the provided environment variable
var connectionString = typeof dbEnvironmentConfig === 'string' ?
    dbEnvironmentConfig :
    process.env[dbEnvironmentConfig.ENV];

var knex = require('knex')({
  client: 'pg',
  connection: connectionString
});

module.exports = require('bookshelf')(knex);