@page bitballs Bitballs
@group bitballs.client Client
@group bitballs.server Server


## Environment Setup

Make sure you have installed:

- Node 5
- NPM 3
- [Postgres](http://www.postgresql.org/)

### Setup the DB

Make sure postgres is running:

```
pg_ctl status -D {DATA_DIR}
```

Then create the database and schema: 

```
npm run db-migrate
```

### Install Dependencies

```
npm install
```

### Start the app

```
npm start
```

### Create an admin user

Go to [http://localhost:5000/dev.html#!user](http://localhost:5000/dev.html#!user).

