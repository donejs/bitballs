@page bitballs Bitballs
@group bitballs.client Client
@group bitballs.server Server

[![Build Status](https://travis-ci.org/donejs/bitballs.svg?branch=master)](https://travis-ci.org/donejs/bitballs)


## Development Setup

To host the Bitballs app locally, run its tests, or generate its documentation,
follow the steps outlined below.

### Setup Environment

Make sure you have installed:

- [Node 5](https://nodejs.org/en/download/)
- NPM 3
- [Postgres](http://www.postgresql.org/)

### Download Source

Clone this repo.

### Install Dependencies

```
npm install
```

### Prepare the Database

Make sure postgres is running:

```
pg_ctl status -D {DATA_DIR}
```

Then create the database and schema by running:

```
createdb bitballs
npm run db-migrate
```

### Start the app

```
npm start
```

### Create an Admin User

Navigate to [http://localhost:5000/dev.html#!user](http://localhost:5000/register)
in your browser and follow the instructions.

### Enjoy

Your finished! Explore some of the app's features:

- Live reload (`donejs develop`)
- Run the tests (`donejs test`)
- Generate the documentation (`donejs document`)

