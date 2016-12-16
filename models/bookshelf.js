var dbConfig = require('../database.json');
var environmentKey = process.env.NODE_ENV === 'production' ? 'prod' : 'dev';
var dbEnvironmentConfig = dbConfig[environmentKey];

// Use the string itself or use the provided environment variable
var connectionString = typeof dbEnvironmentConfig === 'string' ?
	dbEnvironmentConfig :
	process.env[dbEnvironmentConfig.ENV];

if (typeof dbEnvironmentConfig.filename === 'string') {
	connectionString = {
		filename: dbEnvironmentConfig.filename
	};
	// Creates the database if needed
	var driver = require(dbEnvironmentConfig.driver).verbose();
	new driver.Database(dbEnvironmentConfig.filename);
}


var knex = require('knex')({
	client: dbEnvironmentConfig.driver,
	connection: connectionString
});

module.exports = require('bookshelf')(knex);
