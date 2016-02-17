@page bitballs Bitballs
@group bitballs.client Client
@group bitballs.server Server

[![Build Status](https://travis-ci.org/donejs/bitballs.svg?branch=master)](https://travis-ci.org/donejs/bitballs)


## Environment Setup

Make sure you have installed:

- Node 5
- NPM
- [Postgres](http://www.postgresql.org/)


### Install Dependencies

Run:

```
npm install
```

### Setup the DB

Make sure postgres is running:

```
pg_ctl status -D {DATA_DIR}
```

Then create the database and schema by running:

```
npm run db-migrate
```

### Start the app

Run:

```
npm start
```

### Create an admin user

Navigate to [http://localhost:5000/dev.html#!user](http://localhost:5000/dev.html#!user) in your browser.

