
// Prefer 12-factor env vars, fallback to DATABASE_URL
const env = process.env;

const connection = {
	host: env.DB_HOST || 'localhost',
	user: env.DB_USER || 'postgres',
	password: env.DB_PASSWORD || '',
	database: env.DB_NAME || 'bitballs',
	port: env.DB_PORT ? parseInt(env.DB_PORT, 10) : 5432
};

// If DATABASE_URL is set, use it (for Heroku, etc)
const connectionString = env.DATABASE_URL;

const knex = require('knex')({
	client: 'pg',
	connection: connectionString || connection
});

module.exports = require('bookshelf')(knex);
