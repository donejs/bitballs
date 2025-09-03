#!/bin/bash
set -e

# Function to wait for postgres using node
wait_for_postgres() {
    echo "Waiting for PostgreSQL to be ready..."
    until node -e "
        const net = require('net');
        const client = new net.Socket();
        client.connect(5432, '$DB_HOST', () => {
            console.log('PostgreSQL is ready!');
            client.destroy();
            process.exit(0);
        });
        client.on('error', () => {
            client.destroy();
            process.exit(1);
        });
    "; do
        echo "PostgreSQL is unavailable - sleeping"
        sleep 1
    done
}

# Wait for database to be ready
wait_for_postgres

# Run database migrations
echo "Running database migrations..."
npm run db-migrate

# Start the application
echo "Starting the application..."
exec "$@"
