@page bitballs Bitballs
@group bitballs.client Client
@group bitballs.server Server


## Dev Setup

Make sure you have installed:

- Node 5
- [Postgres](http://www.postgresql.org/) (`brew install postgresql` worked best for me)

Then clone from github.

Next, run: 

```
npm install
```

You should do this everytime you pull from github.




### Setup DB


Make sure postgres is running and a `bitballs` schema is created.

Then run:

```
npm install db-migrate
createdb bitballs
./node_modules/db-migrate/bin/db-migrate up
```

You should do this everytime you pull from github.


### Run app

In your console, run:

```
npm start
```

To develop, go to [http://localhost:5000/dev.html#!user](http://localhost:5000/dev.html#!user).

