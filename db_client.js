var pg = require('pg'),
	connectionString = process.env.DATABASE_URL || process.env.HEROKU_POSTGRESQL_TEAL_URL || 'postgres://localhost:5432/bitballs',
	client = new pg.Client(connectionString);
	client.connect();
	
module.exports = client;