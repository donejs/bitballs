# Test Script

## Setup

To clear the database, run:

```
./node_modules/.bin/db-migrate reset
```

until you can't run it anymore

Then run:

```
./node_modules/.bin/db-migrate up
```

To run your app so you can see what's going on, run:

```
node index.js --develop --slow
```

This puts a 1s delay on all responses.

## Verify all pages work when there is no data and no one is logged in.

- Go to every page, make sure things look right.

## Create user

- try to create a user without an `email` or password. Clicking `Register` multiple times should not spawn multiple requests.


- try to create a user without a `password`

- create a user.  You should be logged in and the user's email locked.

## Create Players

- Make sure the placeholder text is showing up.
- Create a player with all the right info.
- Create a player w/o a name ... you shouldn't be able to.


## Update a player

- you should be able to cancel
- you should be able to update









- logout and try to log back in

## Update user's password
