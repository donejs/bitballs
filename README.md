@page bitballs Bitballs
@group bitballs.components Components
@group bitballs.clientModels Client Models
@group bitballs.services Services
@group bitballs.serviceModels Service Models
@hide contents

[![Build Status](https://travis-ci.org/donejs/bitballs.svg?branch=master)](https://travis-ci.org/donejs/bitballs)

Bitballs is a [DoneJS](https://donejs.com) app that enables users to coordinate
the players, teams, games, rounds and recordings of a basketball tournament.
It also serves as an example of how to use DoneJS with sessions, user
privileges, RESTful services, and ORM models.

To run the Bitballs app locally, run its tests, or generate its documentation
follow the steps outlined below.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Setup Environment](#Setup-Environment)
  - [Installing PostgreSQL on OSX](#Installing-PostgreSQL-on-OSX)
  - [Installing PostgreSQL on Linux](#Installing-PostgreSQL-on-Linux)
  - [Installing PostgreSQL on Windows](#Installing-PostgreSQL-on-Windows)
- [Download Source](#Download-Source)
- [Prepare the Database](#Prepare-the-Database)
- [Install Dependencies](#Install-Dependencies)
- [Start the Server](#Start-the-Server)
- [Register a User](#Register-a-User)
- [Enjoy](#Enjoy)

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

Download and use the graphical installer available on [postgresql.org](http://www.postgresql.org/download/windows/). Make sure you host it listen to port `5432`.

Open `pg_hba.conf`, which should be in _C:\Program Files\PostgreSQL\9.5\data_, and change from `md5` authentication to `trust`. For example, change:

> host    all             all             127.0.0.1/32            md5

to:

> host    all             all             127.0.0.1/32            trust

`trust` should not be used in a production environment.  We are only using it here as a substitute for the `peer` mode available in UNIX environments. Read more about it [here](http://www.postgresql.org/docs/9.5/static/auth-methods.html).



Finally, using `pgAdmin III` graphical database manager, which should have been installed with `postgres`, create a `bitballs` database.


### Download Source

Clone this repo using git:

```
git clone https://github.com/donejs/bitballs.git
```

Navigate to the repository's directory

```
cd bitballs
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

### Install Dependencies

To install the project's JavaScript dependencies run:

```
npm install
```

Additionally DoneJS's command line utilities need to be installed globally:

```
npm install -g donejs-cli
```

### Start the Server

With all the prerequisite setup completed the server can be started by running:

```
donejs develop
```
Running the develop command will serve the node app at [http://localhost:5000](http://localhost:5000), and a mail server at [http://localhost:1080](http://localhost:1080). You'll need the mail server in order to verify a new user.

### Register a User

Navigate to [http://localhost:5000/register](http://localhost:5000/register)
in your browser and follow the instructions.

Once you've created a new user, navigate to [http://localhost:1080](http://localhost:1080), and click the verification link in the email. You will now be able to sign in with the user account you created.

### Enjoy

You're finished! Explore some of the app's features:

- Live reload (`donejs develop`)
- Run the tests (`donejs test`)
- Generate the documentation (`donejs document`)
