Outline:

 - What is bitballs.
 	- Why it exists.
 	- High level functionality.
 		- Include ability to login/out and functionality 
 		  dynamically changes.
 	- Where to use it. (link to actual app)
 	- What you are going to learn.
 - High level architecture.
 	- Characteristics: 
 		- Express/NodeJS + DoneJS + Postgres/Bookshelf
 		- Deployed to heroku + firebase
 	- Where things are:
 		- `/` root has things for Express/node
 			- migrations
 			- models
 			- services
 			- views?
 			- index.js
 			- configuration files like:
 			  - package.json
 			  - database.json
 			  - db_client? app.json? 
		- `/public` for things related to DoneJS
			- models
			- components
			- index.stache
	- The service layer.
		- Outline data types. Link to service docs.
	- The components on each page.
		- Visually highlight each custom element on each page.
		- Detail its responsibility. Link to its docs with embedded
		  demo page.
    
 - Sessions
 	- How sessions are used
 		- allow an admin to login, possible someone else could.
	- How users are created.
	- How a session is created / retrieved / deleted server-side.
	- How we tell if a user is logged in or not on the client.
	- How we log someone in.
	- How this works via server-side rendering.
		- we set document.cookie.
		- ajax requests use it.
		- cookie based auth should just work.
	
 	
 - Relationships between models
 	- Tournament Details page
 		- tournament has games, teams.  
 		- able to get data for all of it pretty quick
 		- able to make selects that change options correctly.
 	- game details
 		- gets all players and stats, merges data
 		- when adding a stat, everything updates b/c of can-connect
 		
 - Node services and SSR on the same process.
 	- Why do this?
 		- mostly because if you are using node as a frontend server, you probably want it able to do other things besides can-serve
 	- How to do this.
 		- ssr
 		- live reload
 		- apis
 		- 404s
 		- static resources?
 		
 - Ignore parts of SSR
 	- How to make youtube embed not SSR.
	