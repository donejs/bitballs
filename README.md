@page bitballs Bitballs
@group bitballs.components Components
@group bitballs.clientModels Client Models
@group bitballs.services Services
@group bitballs.serviceModels Service Models

[![Build Status](https://travis-ci.org/donejs/bitballs.svg?branch=master)](https://travis-ci.org/donejs/bitballs)

Bitballs is a [DoneJS](https://donejs.com) app that enables users to coordinate
the players, teams, games, rounds and recordings of a basketball tournament.
It also serves as an example of how to use DoneJS with sessions, user
privileges, RESTful services, and ORM models.

To run the Bitballs app locally, run its tests, or generate its documentation
follow the steps outlined below.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Setup Environment](#setup-environment)
  - [Installing PostgreSQL on OSX](#installing-postgresql-on-osx)
  - [Installing PostgreSQL on Linux](#installing-postgresql-on-linux)
  - [Installing PostgreSQL on Windows](#installing-postgresql-on-windows)
- [Download Source](#download-source)
- [Install Dependencies](#install-dependencies)
- [Prepare the Database](#prepare-the-database)
- [Start the Server](#start-the-server)
- [Register a User](#register-a-user)
- [Enjoy](#enjoy)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

### Setup Environment

Make sure you have installed:

- [Node 5](https://nodejs.org/en/download/)
- NPM 3 *(packaged with Node)*
- [PostgreSQL](https://www.postgresql.org/download/)

#### Installing PostgreSQL on OSX

On a Mac, the easiest way to install and configure [PostgreSQL](https://www.postgresql.org)
is using the [brew](https://brew.sh/) utility:

```
brew install postgresql
```

Pay special attention to the end of the [brew](https://brew.sh/) command's
output, which includes instructions on how to start `postgres`:

```
To load postgresql:
  launchctl load ~/Library/LaunchAgents/homebrew.mxcl.postgresql.plist
Or, if you don't want/need launchctl, you can just run:
  postgres -D /usr/local/var/postgres
```

The provided `launchctl` command ensures the `postgres` process is always
running, even after a system restart. The alternative `postgres` command
starts the `postgres` process manually.

We recommend the `launchctl` option. If desired, `postgres` can be
stopped and uninstalled by running:

```
brew uninstall postgresql
```

#### Installing PostgreSQL on Linux

*Coming Soon*

#### Installing PostgreSQL on Windows

*Coming Soon*

### Download Source

Clone this repo using git:

```
git clone https://github.com/donejs/bitballs.git
```

### Install Dependencies

To install the project's JavaScript dependencies run:

```
npm install
```

Additionally DoneJS's command line utilities need to be installed globally:

```
npm install -g donejs-cli
```

### Prepare the Database

Make sure the `postgres` process is running:

```
ps | grep postgres
```

You should see "postgres -D" among the output:

```
92831 ttys000    0:00.02 postgres -D /usr/local/var/postgres
92856 ttys000    0:00.00 grep postgres
```

With that confirmed we can create the database that the bitballs app
will persist its data to:

```
createdb bitballs
```

Next, create the database schema that the application expects by running:

```
npm run db-migrate
```

### Start the Server

With all the prerequisite setup completed the server can be started by running:

```
donejs start
```

### Register a User

Navigate to [http://localhost:5000/register](http://localhost:5000/register)
in your browser and follow the instructions.

### Enjoy

You're finished! Explore some of the app's features:

- Live reload (`donejs develop`)
- Run the tests (`donejs test`)
- Generate the documentation (`donejs document`)
