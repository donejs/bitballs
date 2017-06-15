/*bitballs@0.3.1#components/tournament/details/details.stache!can@2.3.23#view/stache/system*/
define("bitballs@0.3.1#components/tournament/details/details.stache!can@2.3.23#view/stache/system",["module","can/view/stache/stache","can/view/stache/mustache_core"],function(e,t,a){var r=t([{tokenType:"special",args:["^if tournamentPromise.isRejected"]},{tokenType:"start",args:["h2",!1]},{tokenType:"end",args:["h2",!1]},{tokenType:"special",args:["tournament.year"]},{tokenType:"chars",args:[" Tournament"]},{tokenType:"close",args:["h2"]},{tokenType:"chars",args:["\n"]},{tokenType:"start",args:["p",!1]},{tokenType:"end",args:["p",!1]},{tokenType:"special",args:["tournament.prettyDate"]},{tokenType:"close",args:["p"]},{tokenType:"chars",args:["\n\n"]},{tokenType:"start",args:["h3",!1]},{tokenType:"end",args:["h3",!1]},{tokenType:"chars",args:["Games"]},{tokenType:"close",args:["h3"]},{tokenType:"chars",args:["\n"]},{tokenType:"start",args:["table",!1]},{tokenType:"attrStart",args:["class"]},{tokenType:"attrValue",args:["table"]},{tokenType:"attrEnd",args:["class"]},{tokenType:"end",args:["table",!1]},{tokenType:"chars",args:["\n"]},{tokenType:"start",args:["thead",!1]},{tokenType:"end",args:["thead",!1]},{tokenType:"chars",args:["\n	"]},{tokenType:"start",args:["tr",!1]},{tokenType:"end",args:["tr",!1]},{tokenType:"chars",args:["\n		"]},{tokenType:"start",args:["th",!1]},{tokenType:"end",args:["th",!1]},{tokenType:"chars",args:["Round"]},{tokenType:"close",args:["th"]},{tokenType:"chars",args:["\n		"]},{tokenType:"start",args:["th",!1]},{tokenType:"end",args:["th",!1]},{tokenType:"chars",args:["Court 1"]},{tokenType:"close",args:["th"]},{tokenType:"chars",args:["\n		"]},{tokenType:"start",args:["th",!1]},{tokenType:"end",args:["th",!1]},{tokenType:"chars",args:["Court 2"]},{tokenType:"close",args:["th"]},{tokenType:"chars",args:["\n		"]},{tokenType:"start",args:["th",!1]},{tokenType:"end",args:["th",!1]},{tokenType:"chars",args:["Court 3"]},{tokenType:"close",args:["th"]},{tokenType:"chars",args:["\n		"]},{tokenType:"start",args:["th",!1]},{tokenType:"end",args:["th",!1]},{tokenType:"chars",args:["Court 4"]},{tokenType:"close",args:["th"]},{tokenType:"chars",args:["\n	"]},{tokenType:"close",args:["tr"]},{tokenType:"chars",args:["\n"]},{tokenType:"close",args:["thead"]},{tokenType:"chars",args:["\n"]},{tokenType:"start",args:["tbody",!1]},{tokenType:"end",args:["tbody",!1]},{tokenType:"special",args:["#games.getRoundsWithGames"]},{tokenType:"chars",args:["\n\n	"]},{tokenType:"start",args:["tr",!1]},{tokenType:"end",args:["tr",!1]},{tokenType:"chars",args:["\n		"]},{tokenType:"start",args:["td",!1]},{tokenType:"end",args:["td",!1]},{tokenType:"special",args:["."]},{tokenType:"close",args:["td"]},{tokenType:"special",args:["#each Game.courtNames"]},{tokenType:"chars",args:["\n			"]},{tokenType:"start",args:["td",!1]},{tokenType:"end",args:["td",!1]},{tokenType:"special",args:["#games.getGameForRoundAndCourt ../. ."]},{tokenType:"chars",args:["\n					"]},{tokenType:"start",args:["a",!1]},{tokenType:"attrStart",args:["href"]},{tokenType:"special",args:["routeUrl gameId=id"]},{tokenType:"attrEnd",args:["href"]},{tokenType:"end",args:["a",!1]},{tokenType:"chars",args:["\n						"]},{tokenType:"special",args:["#../teams.getById(homeTeamId)"]},{tokenType:"special",args:["color"]},{tokenType:"special",args:["/teams.getById"]},{tokenType:"chars",args:[" v "]},{tokenType:"special",args:["#../teams.getById(awayTeamId)"]},{tokenType:"special",args:["color"]},{tokenType:"special",args:["/teams.getById"]},{tokenType:"chars",args:["\n					"]},{tokenType:"close",args:["a"]},{tokenType:"special",args:["#if session.isAdmin"]},{tokenType:"chars",args:["\n						"]},{tokenType:"start",args:["button",!1]},{tokenType:"attrStart",args:["type"]},{tokenType:"attrValue",args:["button"]},{tokenType:"attrEnd",args:["type"]},{tokenType:"attrStart",args:["class"]},{tokenType:"attrValue",args:["btn btn-danger btn-xs"]},{tokenType:"attrEnd",args:["class"]},{tokenType:"attrStart",args:["($click)"]},{tokenType:"attrValue",args:["deleteGame(.)"]},{tokenType:"attrEnd",args:["($click)"]},{tokenType:"special",args:["#isDestroying"]},{tokenType:"attrStart",args:["disabled"]},{tokenType:"attrEnd",args:["disabled"]},{tokenType:"special",args:["/isDestroying"]},{tokenType:"end",args:["button",!1]},{tokenType:"chars",args:["\n								"]},{tokenType:"start",args:["span",!0]},{tokenType:"attrStart",args:["class"]},{tokenType:"attrValue",args:["glyphicon glyphicon-remove"]},{tokenType:"attrEnd",args:["class"]},{tokenType:"end",args:["span",!0]},{tokenType:"chars",args:["\n						"]},{tokenType:"close",args:["button"]},{tokenType:"special",args:["/if"]},{tokenType:"chars",args:["\n				"]},{tokenType:"special",args:["/games.getGameForRoundAndCourt"]},{tokenType:"chars",args:["\n			"]},{tokenType:"close",args:["td"]},{tokenType:"special",args:["/each"]},{tokenType:"chars",args:["\n	"]},{tokenType:"close",args:["tr"]},{tokenType:"special",args:["else"]},{tokenType:"chars",args:["\n	"]},{tokenType:"start",args:["tr",!1]},{tokenType:"end",args:["tr",!1]},{tokenType:"start",args:["td",!1]},{tokenType:"attrStart",args:["class"]},{tokenType:"attrValue",args:["text-center lead"]},{tokenType:"attrEnd",args:["class"]},{tokenType:"attrStart",args:["colspan"]},{tokenType:"attrValue",args:["5"]},{tokenType:"attrEnd",args:["colspan"]},{tokenType:"end",args:["td",!1]},{tokenType:"chars",args:["No Games"]},{tokenType:"close",args:["td"]},{tokenType:"close",args:["tr"]},{tokenType:"special",args:["/games.getRoundsWithGames"]},{tokenType:"chars",args:["\n"]},{tokenType:"close",args:["tbody"]},{tokenType:"chars",args:["\n"]},{tokenType:"close",args:["table"]},{tokenType:"special",args:["#if isAdmin"]},{tokenType:"chars",args:["\n"]},{tokenType:"start",args:["h4",!1]},{tokenType:"end",args:["h4",!1]},{tokenType:"chars",args:["New Game"]},{tokenType:"close",args:["h4"]},{tokenType:"chars",args:["\n"]},{tokenType:"start",args:["form",!1]},{tokenType:"attrStart",args:["($submit)"]},{tokenType:"attrValue",args:["createGame(%event)"]},{tokenType:"attrEnd",args:["($submit)"]},{tokenType:"attrStart",args:["action"]},{tokenType:"attrEnd",args:["action"]},{tokenType:"end",args:["form",!1]},{tokenType:"chars",args:["\n\n	"]},{tokenType:"start",args:["div",!1]},{tokenType:"attrStart",args:["class"]},{tokenType:"attrValue",args:["form-group"]},{tokenType:"attrEnd",args:["class"]},{tokenType:"end",args:["div",!1]},{tokenType:"chars",args:["\n	    "]},{tokenType:"start",args:["label",!1]},{tokenType:"attrStart",args:["for"]},{tokenType:"attrValue",args:["game-round"]},{tokenType:"attrEnd",args:["for"]},{tokenType:"end",args:["label",!1]},{tokenType:"chars",args:["Round"]},{tokenType:"close",args:["label"]},{tokenType:"chars",args:["\n	    "]},{tokenType:"start",args:["select",!1]},{tokenType:"attrStart",args:["{($value)}"]},{tokenType:"attrValue",args:["selectedRound"]},{tokenType:"attrEnd",args:["{($value)}"]},{tokenType:"attrStart",args:["class"]},{tokenType:"attrValue",args:["form-control"]},{tokenType:"attrEnd",args:["class"]},{tokenType:"attrStart",args:["id"]},{tokenType:"attrValue",args:["game-round"]},{tokenType:"attrEnd",args:["id"]},{tokenType:"end",args:["select",!1]},{tokenType:"special",args:["#games.getAvailableRounds"]},{tokenType:"chars",args:["\n	    		"]},{tokenType:"start",args:["option",!1]},{tokenType:"attrStart",args:["value"]},{tokenType:"special",args:["."]},{tokenType:"attrEnd",args:["value"]},{tokenType:"end",args:["option",!1]},{tokenType:"special",args:["."]},{tokenType:"close",args:["option"]},{tokenType:"special",args:["/games.getAvailableRounds"]},{tokenType:"chars",args:["\n	    "]},{tokenType:"close",args:["select"]},{tokenType:"chars",args:["\n	"]},{tokenType:"close",args:["div"]},{tokenType:"chars",args:["\n\n	"]},{tokenType:"start",args:["div",!1]},{tokenType:"attrStart",args:["class"]},{tokenType:"attrValue",args:["form-group"]},{tokenType:"attrEnd",args:["class"]},{tokenType:"end",args:["div",!1]},{tokenType:"chars",args:["\n	    "]},{tokenType:"start",args:["label",!1]},{tokenType:"attrStart",args:["for"]},{tokenType:"attrValue",args:["game-court"]},{tokenType:"attrEnd",args:["for"]},{tokenType:"end",args:["label",!1]},{tokenType:"chars",args:["Court"]},{tokenType:"close",args:["label"]},{tokenType:"chars",args:["\n	    "]},{tokenType:"start",args:["select",!1]},{tokenType:"attrStart",args:["{($value)}"]},{tokenType:"attrValue",args:["selectedCourt"]},{tokenType:"attrEnd",args:["{($value)}"]},{tokenType:"attrStart",args:["class"]},{tokenType:"attrValue",args:["form-control"]},{tokenType:"attrEnd",args:["class"]},{tokenType:"attrStart",args:["id"]},{tokenType:"attrValue",args:["game-court"]},{tokenType:"attrEnd",args:["id"]},{tokenType:"end",args:["select",!1]},{tokenType:"special",args:["#games.getAvailableCourts(selectedRound)"]},{tokenType:"chars",args:["\n			"]},{tokenType:"start",args:["option",!1]},{tokenType:"attrStart",args:["value"]},{tokenType:"special",args:["."]},{tokenType:"attrEnd",args:["value"]},{tokenType:"end",args:["option",!1]},{tokenType:"special",args:["."]},{tokenType:"close",args:["option"]},{tokenType:"special",args:["/games.getAvailableCourts"]},{tokenType:"chars",args:["\n	    "]},{tokenType:"close",args:["select"]},{tokenType:"chars",args:["\n	"]},{tokenType:"close",args:["div"]},{tokenType:"chars",args:["\n\n	"]},{tokenType:"start",args:["div",!1]},{tokenType:"attrStart",args:["class"]},{tokenType:"attrValue",args:["form-group"]},{tokenType:"attrEnd",args:["class"]},{tokenType:"end",args:["div",!1]},{tokenType:"chars",args:["\n	    "]},{tokenType:"start",args:["label",!1]},{tokenType:"attrStart",args:["for"]},{tokenType:"attrValue",args:["game-home"]},{tokenType:"attrEnd",args:["for"]},{tokenType:"end",args:["label",!1]},{tokenType:"chars",args:["Home team"]},{tokenType:"close",args:["label"]},{tokenType:"chars",args:["\n	    "]},{tokenType:"start",args:["select",!1]},{tokenType:"attrStart",args:["{($value)}"]},{tokenType:"attrValue",args:["game.homeTeamId"]},{tokenType:"attrEnd",args:["{($value)}"]},{tokenType:"attrStart",args:["class"]},{tokenType:"attrValue",args:["form-control"]},{tokenType:"attrEnd",args:["class"]},{tokenType:"attrStart",args:["id"]},{tokenType:"attrValue",args:["game-home"]},{tokenType:"attrEnd",args:["id"]},{tokenType:"end",args:["select",!1]},{tokenType:"chars",args:["\n	    	"]},{tokenType:"start",args:["option",!0]},{tokenType:"attrStart",args:["value"]},{tokenType:"attrEnd",args:["value"]},{tokenType:"end",args:["option",!0]},{tokenType:"special",args:['#each ~availableTeamFor("home", selectedRound)']},{tokenType:"chars",args:["\n	    		"]},{tokenType:"start",args:["option",!1]},{tokenType:"attrStart",args:["value"]},{tokenType:"special",args:["id"]},{tokenType:"attrEnd",args:["value"]},{tokenType:"end",args:["option",!1]},{tokenType:"special",args:["color"]},{tokenType:"chars",args:[" - "]},{tokenType:"special",args:["name"]},{tokenType:"close",args:["option"]},{tokenType:"special",args:["/each"]},{tokenType:"chars",args:["\n	    "]},{tokenType:"close",args:["select"]},{tokenType:"chars",args:["\n		"]},{tokenType:"start",args:["label",!1]},{tokenType:"attrStart",args:["for"]},{tokenType:"attrValue",args:["game-away"]},{tokenType:"attrEnd",args:["for"]},{tokenType:"end",args:["label",!1]},{tokenType:"chars",args:["Away team"]},{tokenType:"close",args:["label"]},{tokenType:"chars",args:["\n	    "]},{tokenType:"start",args:["select",!1]},{tokenType:"attrStart",args:["{($value)}"]},{tokenType:"attrValue",args:["game.awayTeamId"]},{tokenType:"attrEnd",args:["{($value)}"]},{tokenType:"attrStart",args:["class"]},{tokenType:"attrValue",args:["form-control"]},{tokenType:"attrEnd",args:["class"]},{tokenType:"attrStart",args:["id"]},{tokenType:"attrValue",args:["game-away"]},{tokenType:"attrEnd",args:["id"]},{tokenType:"end",args:["select",!1]},{tokenType:"chars",args:["\n	    	"]},{tokenType:"start",args:["option",!0]},{tokenType:"attrStart",args:["value"]},{tokenType:"attrEnd",args:["value"]},{tokenType:"end",args:["option",!0]},{tokenType:"special",args:['#each ~availableTeamFor("away", selectedRound)']},{tokenType:"chars",args:["\n	    		"]},{tokenType:"start",args:["option",!1]},{tokenType:"attrStart",args:["value"]},{tokenType:"special",args:["id"]},{tokenType:"attrEnd",args:["value"]},{tokenType:"end",args:["option",!1]},{tokenType:"special",args:["color"]},{tokenType:"chars",args:[" - "]},{tokenType:"special",args:["name"]},{tokenType:"close",args:["option"]},{tokenType:"special",args:["/each"]},{tokenType:"chars",args:["\n	    "]},{tokenType:"close",args:["select"]},{tokenType:"chars",args:["\n	"]},{tokenType:"close",args:["div"]},{tokenType:"chars",args:["\n\n\n\n	"]},{tokenType:"start",args:["div",!1]},{tokenType:"attrStart",args:["class"]},{tokenType:"attrValue",args:["form-group"]},{tokenType:"attrEnd",args:["class"]},{tokenType:"end",args:["div",!1]},{tokenType:"chars",args:["\n	    "]},{tokenType:"start",args:["label",!1]},{tokenType:"attrStart",args:["for"]},{tokenType:"attrValue",args:["game-videoUrl"]},{tokenType:"attrEnd",args:["for"]},{tokenType:"end",args:["label",!1]},{tokenType:"chars",args:["YouTube URL"]},{tokenType:"close",args:["label"]},{tokenType:"chars",args:["\n	    "]},{tokenType:"start",args:["input",!0]},{tokenType:"attrStart",args:["type"]},{tokenType:"attrValue",args:["text"]},{tokenType:"attrEnd",args:["type"]},{tokenType:"attrStart",args:["class"]},{tokenType:"attrValue",args:["form-control"]},{tokenType:"attrEnd",args:["class"]},{tokenType:"attrStart",args:["id"]},{tokenType:"attrValue",args:["game-videoUrl"]},{tokenType:"attrEnd",args:["id"]},{tokenType:"attrStart",args:["placeholder"]},{tokenType:"attrValue",args:["https://www.youtube.com/watch?v=y5z1Ym2uJfs"]},{tokenType:"attrEnd",args:["placeholder"]},{tokenType:"attrStart",args:["{($value)}"]},{tokenType:"attrValue",args:["{game.videoUrl}"]},{tokenType:"attrEnd",args:["{($value)}"]},{tokenType:"end",args:["input",!0]},{tokenType:"chars",args:["\n	"]},{tokenType:"close",args:["div"]},{tokenType:"chars",args:["\n\n	"]},{tokenType:"start",args:["button",!1]},{tokenType:"attrStart",args:["type"]},{tokenType:"attrValue",args:["submit"]},{tokenType:"attrEnd",args:["type"]},{tokenType:"attrStart",args:["class"]},{tokenType:"attrValue",args:["btn btn-default"]},{tokenType:"attrEnd",args:["class"]},{tokenType:"end",args:["button",!1]},{tokenType:"chars",args:["Create"]},{tokenType:"close",args:["button"]},{tokenType:"chars",args:["\n"]},{tokenType:"close",args:["form"]},{tokenType:"special",args:["/if"]},{tokenType:"chars",args:["\n\n"]},{tokenType:"start",args:["h2",!1]},{tokenType:"end",args:["h2",!1]},{tokenType:"chars",args:["Teams"]},{tokenType:"close",args:["h2"]},{tokenType:"chars",args:["\n"]},{tokenType:"start",args:["table",!1]},{tokenType:"attrStart",args:["class"]},{tokenType:"attrValue",args:["table"]},{tokenType:"attrEnd",args:["class"]},{tokenType:"end",args:["table",!1]},{tokenType:"chars",args:["\n"]},{tokenType:"start",args:["thead",!1]},{tokenType:"end",args:["thead",!1]},{tokenType:"chars",args:["\n	"]},{tokenType:"start",args:["tr",!1]},{tokenType:"end",args:["tr",!1]},{tokenType:"chars",args:["\n		"]},{tokenType:"start",args:["th",!1]},{tokenType:"end",args:["th",!1]},{tokenType:"chars",args:["Name"]},{tokenType:"close",args:["th"]},{tokenType:"chars",args:["\n		"]},{tokenType:"start",args:["th",!1]},{tokenType:"end",args:["th",!1]},{tokenType:"chars",args:["Color"]},{tokenType:"close",args:["th"]},{tokenType:"chars",args:["\n		"]},{tokenType:"start",args:["th",!1]},{tokenType:"end",args:["th",!1]},{tokenType:"chars",args:["Player 1"]},{tokenType:"close",args:["th"]},{tokenType:"chars",args:["\n		"]},{tokenType:"start",args:["th",!1]},{tokenType:"end",args:["th",!1]},{tokenType:"chars",args:["Player 2"]},{tokenType:"close",args:["th"]},{tokenType:"chars",args:["\n		"]},{tokenType:"start",args:["th",!1]},{tokenType:"end",args:["th",!1]},{tokenType:"chars",args:["Player 3"]},{tokenType:"close",args:["th"]},{tokenType:"chars",args:["\n		"]},{tokenType:"start",args:["th",!1]},{tokenType:"end",args:["th",!1]},{tokenType:"chars",args:["Player 4"]},{tokenType:"close",args:["th"]},{tokenType:"special",args:["#if isAdmin"]},{tokenType:"chars",args:["\n		"]},{tokenType:"start",args:["th",!1]},{tokenType:"end",args:["th",!1]},{tokenType:"close",args:["th"]},{tokenType:"special",args:["/if"]},{tokenType:"chars",args:["\n	"]},{tokenType:"close",args:["tr"]},{tokenType:"chars",args:["\n"]},{tokenType:"close",args:["thead"]},{tokenType:"chars",args:["\n"]},{tokenType:"start",args:["tbody",!1]},{tokenType:"end",args:["tbody",!1]},{tokenType:"special",args:["#each teams"]},{tokenType:"chars",args:["\n	"]},{tokenType:"start",args:["tr",!1]},{tokenType:"end",args:["tr",!1]},{tokenType:"chars",args:["\n		"]},{tokenType:"start",args:["td",!1]},{tokenType:"end",args:["td",!1]},{tokenType:"special",args:["name"]},{tokenType:"close",args:["td"]},{tokenType:"chars",args:["\n		"]},{tokenType:"start",args:["td",!1]},{tokenType:"end",args:["td",!1]},{tokenType:"special",args:["color"]},{tokenType:"close",args:["td"]},{tokenType:"chars",args:["\n		"]},{tokenType:"start",args:["td",!1]},{tokenType:"end",args:["td",!1]},{tokenType:"special",args:["#../players.getById(player1Id)"]},{tokenType:"special",args:["name"]},{tokenType:"special",args:["/"]},{tokenType:"close",args:["td"]},{tokenType:"chars",args:["\n		"]},{tokenType:"start",args:["td",!1]},{tokenType:"end",args:["td",!1]},{tokenType:"special",args:["#../players.getById(player2Id)"]},{tokenType:"special",args:["name"]},{tokenType:"special",args:["/"]},{tokenType:"close",args:["td"]},{tokenType:"chars",args:["\n		"]},{tokenType:"start",args:["td",!1]},{tokenType:"end",args:["td",!1]},{tokenType:"special",args:["#../players.getById(player3Id)"]},{tokenType:"special",args:["name"]},{tokenType:"special",args:["/"]},{tokenType:"close",args:["td"]},{tokenType:"chars",args:["\n		"]},{tokenType:"start",args:["td",!1]},{tokenType:"end",args:["td",!1]},{tokenType:"special",args:["#../players.getById(player4Id)"]},{tokenType:"special",args:["name"]},{tokenType:"special",args:["/"]},{tokenType:"close",args:["td"]},{tokenType:"special",args:["#if isAdmin"]},{tokenType:"chars",args:["\n			"]},{tokenType:"start",args:["td",!1]},{tokenType:"end",args:["td",!1]},{tokenType:"chars",args:["\n				"]},{tokenType:"start",args:["button",!1]},{tokenType:"attrStart",args:["type"]},{tokenType:"attrValue",args:["button"]},{tokenType:"attrEnd",args:["type"]},{tokenType:"attrStart",args:["class"]},{tokenType:"attrValue",args:["btn btn-danger"]},{tokenType:"attrEnd",args:["class"]},{tokenType:"attrStart",args:["($click)"]},{tokenType:"attrValue",args:["deleteTeam(.)"]},{tokenType:"attrEnd",args:["($click)"]},{tokenType:"special",args:["#isDestroying"]},{tokenType:"attrStart",args:["disabled"]},{tokenType:"attrEnd",args:["disabled"]},{tokenType:"special",args:["/isDestroying"]},{tokenType:"end",args:["button",!1]},{tokenType:"chars",args:["\n						"]},{tokenType:"start",args:["span",!0]},{tokenType:"attrStart",args:["class"]},{tokenType:"attrValue",args:["glyphicon glyphicon-remove"]},{tokenType:"attrEnd",args:["class"]},{tokenType:"end",args:["span",!0]},{tokenType:"chars",args:["\n				"]},{tokenType:"close",args:["button"]},{tokenType:"chars",args:["\n			"]},{tokenType:"close",args:["td"]},{tokenType:"special",args:["/if"]},{tokenType:"chars",args:["\n	"]},{tokenType:"close",args:["tr"]},{tokenType:"special",args:["else"]},{tokenType:"chars",args:["\n	"]},{tokenType:"start",args:["tr",!1]},{tokenType:"end",args:["tr",!1]},{tokenType:"start",args:["td",!1]},{tokenType:"attrStart",args:["class"]},{tokenType:"attrValue",args:["text-center lead"]},{tokenType:"attrEnd",args:["class"]},{tokenType:"attrStart",args:["colspan"]},{tokenType:"special",args:["#if isAdmin"]},{tokenType:"attrValue",args:["6"]},{tokenType:"special",args:["else"]},{tokenType:"attrValue",args:["7"]},{tokenType:"special",args:["/if"]},{tokenType:"attrEnd",args:["colspan"]},{tokenType:"end",args:["td",!1]},{tokenType:"chars",args:["No Teams"]},{tokenType:"close",args:["td"]},{tokenType:"close",args:["tr"]},{tokenType:"special",args:["/each"]},{tokenType:"chars",args:["\n"]},{tokenType:"close",args:["tbody"]},{tokenType:"chars",args:["\n"]},{tokenType:"close",args:["table"]},{tokenType:"special",args:["#if isAdmin"]},{tokenType:"chars",args:["\n"]},{tokenType:"start",args:["h4",!1]},{tokenType:"end",args:["h4",!1]},{tokenType:"chars",args:["New Team"]},{tokenType:"close",args:["h4"]},{tokenType:"chars",args:["\n"]},{tokenType:"start",args:["form",!1]},{tokenType:"attrStart",args:["($submit)"]},{tokenType:"attrValue",args:["createTeam(%event)"]},{tokenType:"attrEnd",args:["($submit)"]},{tokenType:"attrStart",args:["action"]},{tokenType:"attrEnd",args:["action"]},{tokenType:"end",args:["form",!1]},{tokenType:"chars",args:["\n\n	"]},{tokenType:"start",args:["div",!1]},{tokenType:"attrStart",args:["class"]},{tokenType:"attrValue",args:["form-group"]},{tokenType:"attrEnd",args:["class"]},{tokenType:"end",args:["div",!1]},{tokenType:"chars",args:["\n	    "]},{tokenType:"start",args:["label",!1]},{tokenType:"attrStart",args:["for"]},{tokenType:"attrValue",args:["team-name"]},{tokenType:"attrEnd",args:["for"]},{tokenType:"end",args:["label",!1]},{tokenType:"chars",args:["Name"]},{tokenType:"close",args:["label"]},{tokenType:"chars",args:["\n	    "]},{tokenType:"start",args:["input",!0]},{tokenType:"attrStart",args:["type"]},{tokenType:"attrValue",args:["text"]},{tokenType:"attrEnd",args:["type"]},{tokenType:"attrStart",args:["class"]},{tokenType:"attrValue",args:["form-control"]},{tokenType:"attrEnd",args:["class"]},{tokenType:"attrStart",args:["id"]},{tokenType:"attrValue",args:["team-name"]},{tokenType:"attrEnd",args:["id"]},{tokenType:"attrStart",args:["placeholder"]},{tokenType:"attrValue",args:["team name"]},{tokenType:"attrEnd",args:["placeholder"]},{tokenType:"attrStart",args:["{($value)}"]},{tokenType:"attrValue",args:["team.name"]},{tokenType:"attrEnd",args:["{($value)}"]},{tokenType:"end",args:["input",!0]},{tokenType:"chars",args:["\n	"]},{tokenType:"close",args:["div"]},{tokenType:"chars",args:["\n\n	"]},{tokenType:"start",args:["div",!1]},{tokenType:"attrStart",args:["class"]},{tokenType:"attrValue",args:["form-group"]},{tokenType:"attrEnd",args:["class"]},{tokenType:"end",args:["div",!1]},{tokenType:"chars",args:["\n	    "]},{tokenType:"start",args:["label",!1]},{tokenType:"attrStart",args:["for"]},{tokenType:"attrValue",args:["team-color"]},{tokenType:"attrEnd",args:["for"]},{tokenType:"end",args:["label",!1]},{tokenType:"chars",args:["Color"]},{tokenType:"close",args:["label"]},{tokenType:"chars",args:["\n	    "]},{tokenType:"start",args:["select",!1]},{tokenType:"attrStart",args:["{($value)}"]},{tokenType:"attrValue",args:["team.color"]},{tokenType:"attrEnd",args:["{($value)}"]},{tokenType:"attrStart",args:["class"]},{tokenType:"attrValue",args:["form-control"]},{tokenType:"attrEnd",args:["class"]},{tokenType:"attrStart",args:["id"]},{tokenType:"attrValue",args:["team-color"]},{tokenType:"attrEnd",args:["id"]},{tokenType:"end",args:["select",!1]},{tokenType:"special",args:["#each availableColors"]},{tokenType:"chars",args:["\n	    		"]},{tokenType:"start",args:["option",!1]},{tokenType:"attrStart",args:["value"]},{tokenType:"special",args:["."]},{tokenType:"attrEnd",args:["value"]},{tokenType:"end",args:["option",!1]},{tokenType:"special",args:["."]},{tokenType:"close",args:["option"]},{tokenType:"special",args:["/each"]},{tokenType:"chars",args:["\n	    "]},{tokenType:"close",args:["select"]},{tokenType:"chars",args:["\n	  "]},{tokenType:"close",args:["div"]},{tokenType:"chars",args:["\n	"]},{tokenType:"chars",args:["\n\n	"]},{tokenType:"start",args:["div",!1]},{tokenType:"attrStart",args:["class"]},{tokenType:"attrValue",args:["form-group"]},{tokenType:"attrEnd",args:["class"]},{tokenType:"end",args:["div",!1]},{tokenType:"chars",args:["\n	    "]},{tokenType:"start",args:["label",!1]},{tokenType:"attrStart",args:["for"]},{tokenType:"attrValue",args:["team-player1"]},{tokenType:"attrEnd",args:["for"]},{tokenType:"end",args:["label",!1]},{tokenType:"chars",args:["Player 1"]},{tokenType:"close",args:["label"]},{tokenType:"chars",args:["\n	    "]},{tokenType:"start",args:["select",!1]},{tokenType:"attrStart",args:["{($value)}"]},{tokenType:"attrValue",args:["team.player1Id"]},{tokenType:"attrEnd",args:["{($value)}"]},{tokenType:"attrStart",args:["class"]},{tokenType:"attrValue",args:["form-control"]},{tokenType:"attrEnd",args:["class"]},{tokenType:"attrStart",args:["id"]},{tokenType:"attrValue",args:["team-player1"]},{tokenType:"attrEnd",args:["id"]},{tokenType:"end",args:["select",!1]},{tokenType:"chars",args:["\n	    	"]},{tokenType:"start",args:["option",!0]},{tokenType:"attrStart",args:["value"]},{tokenType:"attrEnd",args:["value"]},{tokenType:"end",args:["option",!0]},{tokenType:"special",args:["#eachOf ~availablePlayersFor(team,1)"]},{tokenType:"chars",args:["\n	    		"]},{tokenType:"start",args:["option",!1]},{tokenType:"attrStart",args:["value"]},{tokenType:"special",args:["id"]},{tokenType:"attrEnd",args:["value"]},{tokenType:"end",args:["option",!1]},{tokenType:"special",args:["name"]},{tokenType:"close",args:["option"]},{tokenType:"special",args:["/eachOf"]},{tokenType:"chars",args:["\n	    "]},{tokenType:"close",args:["select"]},{tokenType:"chars",args:["\n	  "]},{tokenType:"close",args:["div"]},{tokenType:"chars",args:["\n	"]},{tokenType:"chars",args:["\n\n	"]},{tokenType:"start",args:["div",!1]},{tokenType:"attrStart",args:["class"]},{tokenType:"attrValue",args:["form-group"]},{tokenType:"attrEnd",args:["class"]},{tokenType:"end",args:["div",!1]},{tokenType:"chars",args:["\n	    "]},{tokenType:"start",args:["label",!1]},{tokenType:"attrStart",args:["for"]},{tokenType:"attrValue",args:["team-player2"]},{tokenType:"attrEnd",args:["for"]},{tokenType:"end",args:["label",!1]},{tokenType:"chars",args:["Player 2"]},{tokenType:"close",args:["label"]},{tokenType:"chars",args:["\n	    "]},{tokenType:"start",args:["select",!1]},{tokenType:"attrStart",args:["{($value)}"]},{tokenType:"attrValue",args:["team.player2Id"]},{tokenType:"attrEnd",args:["{($value)}"]},{tokenType:"attrStart",args:["class"]},{tokenType:"attrValue",args:["form-control"]},{tokenType:"attrEnd",args:["class"]},{tokenType:"attrStart",args:["id"]},{tokenType:"attrValue",args:["team-player2"]},{tokenType:"attrEnd",args:["id"]},{tokenType:"end",args:["select",!1]},{tokenType:"chars",args:["\n	    	"]},{tokenType:"start",args:["option",!0]},{tokenType:"attrStart",args:["value"]},{tokenType:"attrEnd",args:["value"]},{tokenType:"end",args:["option",!0]},{tokenType:"special",args:["#eachOf ~availablePlayersFor(team,2)"]},{tokenType:"chars",args:["\n	    		"]},{tokenType:"start",args:["option",!1]},{tokenType:"attrStart",args:["value"]},{tokenType:"special",args:["id"]},{tokenType:"attrEnd",args:["value"]},{tokenType:"end",args:["option",!1]},{tokenType:"special",args:["name"]},{tokenType:"close",args:["option"]},{tokenType:"special",args:["/eachOf"]},{tokenType:"chars",args:["\n	    "]},{tokenType:"close",args:["select"]},{tokenType:"chars",args:["\n	  "]},{tokenType:"close",args:["div"]},{tokenType:"chars",args:["\n	"]},{tokenType:"chars",args:["\n\n	"]},{tokenType:"start",args:["div",!1]},{tokenType:"attrStart",args:["class"]},{tokenType:"attrValue",args:["form-group"]},{tokenType:"attrEnd",args:["class"]},{tokenType:"end",args:["div",!1]},{tokenType:"chars",args:["\n	    "]},{tokenType:"start",args:["label",!1]},{tokenType:"attrStart",args:["for"]},{tokenType:"attrValue",args:["team-player3"]},{tokenType:"attrEnd",args:["for"]},{tokenType:"end",args:["label",!1]},{tokenType:"chars",args:["Player 3"]},{tokenType:"close",args:["label"]},{tokenType:"chars",args:["\n	    "]},{tokenType:"start",args:["select",!1]},{tokenType:"attrStart",args:["{($value)}"]},{tokenType:"attrValue",args:["team.player3Id"]},{tokenType:"attrEnd",args:["{($value)}"]},{tokenType:"attrStart",args:["class"]},{tokenType:"attrValue",args:["form-control"]},{tokenType:"attrEnd",args:["class"]},{tokenType:"attrStart",args:["id"]},{tokenType:"attrValue",args:["team-player3"]},{tokenType:"attrEnd",args:["id"]},{tokenType:"end",args:["select",!1]},{tokenType:"chars",args:["\n	    	"]},{tokenType:"start",args:["option",!0]},{tokenType:"attrStart",args:["value"]},{tokenType:"attrEnd",args:["value"]},{tokenType:"end",args:["option",!0]},{tokenType:"special",args:["#eachOf ~availablePlayersFor(team,3)"]},{tokenType:"chars",args:["\n	    		"]},{tokenType:"start",args:["option",!1]},{tokenType:"attrStart",args:["value"]},{tokenType:"special",args:["id"]},{tokenType:"attrEnd",args:["value"]},{tokenType:"end",args:["option",!1]},{tokenType:"special",args:["name"]},{tokenType:"close",args:["option"]},{tokenType:"special",args:["/eachOf"]},{tokenType:"chars",args:["\n	    "]},{tokenType:"close",args:["select"]},{tokenType:"chars",args:["\n	  "]},{tokenType:"close",args:["div"]},{tokenType:"chars",args:["\n	"]},{tokenType:"chars",args:["\n\n	"]},{tokenType:"start",args:["div",!1]},{tokenType:"attrStart",args:["class"]},{tokenType:"attrValue",args:["form-group"]},{tokenType:"attrEnd",args:["class"]},{tokenType:"end",args:["div",!1]},{tokenType:"chars",args:["\n	    "]},{tokenType:"start",args:["label",!1]},{tokenType:"attrStart",args:["for"]},{tokenType:"attrValue",args:["team-player4"]},{tokenType:"attrEnd",args:["for"]},{tokenType:"end",args:["label",!1]},{tokenType:"chars",args:["Player 4"]},{tokenType:"close",args:["label"]},{tokenType:"chars",args:["\n	    "]},{tokenType:"start",args:["select",!1]},{tokenType:"attrStart",args:["{($value)}"]},{tokenType:"attrValue",args:["team.player4Id"]},{tokenType:"attrEnd",args:["{($value)}"]},{tokenType:"attrStart",args:["class"]},{tokenType:"attrValue",args:["form-control"]},{tokenType:"attrEnd",args:["class"]},{tokenType:"attrStart",args:["id"]},{tokenType:"attrValue",args:["team-player4"]},{tokenType:"attrEnd",args:["id"]},{tokenType:"end",args:["select",!1]},{tokenType:"chars",args:["\n	    	"]},{tokenType:"start",args:["option",!0]},{tokenType:"attrStart",args:["value"]},{tokenType:"attrEnd",args:["value"]},{tokenType:"end",args:["option",!0]},{tokenType:"special",args:["#eachOf ~availablePlayersFor(team,4)"]},{tokenType:"chars",args:["\n	    		"]},{tokenType:"start",args:["option",!1]},{tokenType:"attrStart",args:["value"]},{tokenType:"special",args:["id"]},{tokenType:"attrEnd",args:["value"]},{tokenType:"end",args:["option",!1]},{tokenType:"special",args:["name"]},{tokenType:"close",args:["option"]},{tokenType:"special",args:["/eachOf"]},{tokenType:"chars",args:["\n	    "]},{tokenType:"close",args:["select"]},{tokenType:"chars",args:["\n	  "]},{tokenType:"close",args:["div"]},{tokenType:"chars",args:["\n	"]},{tokenType:"chars",args:["\n\n	"]},{tokenType:"start",args:["button",!1]},{tokenType:"attrStart",args:["type"]},{tokenType:"attrValue",args:["submit"]},{tokenType:"attrEnd",args:["type"]},{tokenType:"attrStart",args:["class"]},{tokenType:"attrValue",args:["btn btn-default"]},{tokenType:"attrEnd",args:["class"]},{tokenType:"end",args:["button",!1]},{tokenType:"chars",args:["Create"]},{tokenType:"close",args:["button"]},{tokenType:"special",args:["#if teamSavePromise.isRejected"]},{tokenType:"chars",args:["\n	"]},{tokenType:"special",args:["#each teamSavePromise.reason.responseJSON"]},{tokenType:"chars",args:["\n		"]},{tokenType:"start",args:["p",!1]},{tokenType:"attrStart",args:["class"]},{tokenType:"attrValue",args:["text-danger"]},{tokenType:"attrEnd",args:["class"]},{tokenType:"end",args:["p",!1]},{tokenType:"special",args:["."]},{tokenType:"close",args:["p"]},{tokenType:"special",args:["/each"]},{tokenType:"chars",args:["\n	"]},{tokenType:"special",args:["/if"]},{tokenType:"chars",args:["\n"]},{tokenType:"close",args:["form"]},{tokenType:"special",args:["/if"]},{tokenType:"chars",args:["\n"]},{tokenType:"special",args:["else"]},{tokenType:"chars",args:["\n	Tournament not found."]},{tokenType:"special",args:["/if"]},{tokenType:"chars",
args:["\n"]},{tokenType:"done",args:[]}]);return function(t,s,n){var o={module:e};return s instanceof a.Options||(s=new a.Options(s||{})),r(t,s.add(o),n)}});
/*bitballs@0.3.1#components/tournament/details/details*/
define("bitballs@0.3.1#components/tournament/details/details",function(t,e,a){var r=t("can/component/component"),n=t("can/map/"),o=t("bitballs/models/team"),i=t("bitballs/models/game"),s=t("bitballs/models/player"),u=t("bitballs/models/tournament");t("can/map/define/"),t("bootstrap/dist/css/bootstrap.css!"),t("can/route/"),t("can/view/href/"),e.ViewModel=n.extend({init:function(){this.bind("userSelectedRound",function(){this.attr("userSelectedCourt",null)}),this.bind("gamesLength",function(){this.attr("userSelectedRound",null)})},define:{tournamentPromise:{get:function(){return u.get({id:this.attr("tournamentId")})}},isAdmin:{type:"boolean",value:!1},tournament:{get:function(t,e){this.attr("tournamentPromise").then(e)}},gamesPromise:{get:function(){return i.getList({where:{tournamentId:this.attr("tournamentId")}})}},games:{get:function(t,e){this.attr("gamesPromise").then(e)}},gamesLength:{get:function(){return this.attr("games.length")}},teamsPromise:{get:function(){return o.getList({where:{tournamentId:this.attr("tournamentId")}})}},teams:{get:function(t,e){this.attr("teamsPromise").then(e)}},availableColors:{type:"*",get:function(){var t=this.attr("teams");if(t){var e=o.colors.slice(0);return t.each(function(t){var a=e.indexOf(t.attr("color"));-1!==a&&e.splice(a,1)}),e}return o.colors}},game:{Value:i},team:{Value:o},playersPromise:{value:function(){return s.getList({orderBy:"name"})}},players:{get:function(t,e){this.attr("playersPromise").then(e)}},userSelectedRound:{value:null},selectedRound:{set:function(t){return this.attr("userSelectedRound",t),t},get:function(){return this.attr("userSelectedRound")||this.attr("games")&&this.attr("games").getAvailableRounds()[0]}},userSelectedCourt:{value:null},selectedCourt:{set:function(t){return this.attr("userSelectedCourt",t),t},get:function(){return this.attr("userSelectedCourt")||this.attr("games")&&this.attr("games").getAvailableCourts(this.attr("selectedRound"))[0]}},teamIdMap:{type:"*",get:function(){var t={},e=this.attr("teams");return e&&e.each(function(e){t[e.attr("id")]=e}),t}}},availableTeamFor:function(t,e){var a=this.attr("teams"),r=this.attr("games");if(!r||!a)return[];if(!e)return a;a.attr("length");var n=a.slice(0);r.forEach(function(t){t.attr("round")===e&&(n.removeById(t.attr("homeTeamId")),n.removeById(t.attr("awayTeamId")))});var o="home"===t?"away":"home",i=this.attr("game").attr(o+"TeamId");return i&&n.removeById(i),n},availablePlayersFor:function(t,e){var a=this.attr("players"),r=this.attr("teams");if(a&&r){var n={};return r.each(function(e){e!==t&&[1,2,3,4].forEach(function(t){n[e.attr("player"+t+"Id")]=!0})}),[1,2,3,4].forEach(function(a){a!==e&&(n[t.attr("player"+a+"Id")]=!0)}),a.filter(function(t){return!n[t.attr("id")]})}return[]},createTeam:function(t){t&&t.preventDefault();var e=this;this.attr("team.color")||this.attr("team").attr("color",this.attr("availableColors")[0]);var a=this.attr("team").attr("tournamentId",this.attr("tournamentId")).save(function(){e.attr("team",new o)});this.attr("teamSavePromise",a)},Game:i,createGame:function(t){t.preventDefault();var e=this,a=this.attr("game");a.attr({round:this.attr("selectedRound"),court:this.attr("selectedCourt"),tournamentId:this.attr("tournamentId")}).save(function(){e.attr("game",new i)})},deleteGame:function(t){window.confirm("Are you sure you want to delete this game?")&&t.destroy()},deleteTeam:function(t){window.confirm("Are you sure you want to delete this team?")&&t.destroy()}}),e.Component=r.extend({tag:"tournament-details",template:t("./details.stache!"),viewModel:e.ViewModel})});