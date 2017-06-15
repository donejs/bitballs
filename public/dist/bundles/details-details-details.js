define("bitballs@0.4.0#models/team",function(e,t,n){var a=e("can-connect/can/super-map/"),r=e("can-connect/can/tag/"),i=e("can-set"),s=e("./player"),o=e("can-define/map/map"),u=e("can-define/list/list"),c=o.extend("Team",{colors:["Black","White","Red","Green","Blue","Yellow","Brown","Gray","Orange","Purple"]},{id:"number",tournamentId:"number",player1:s,player2:s,player3:s,player4:s,name:"string",color:"string",player1Id:"number",player2Id:"number",player3Id:"number",player4Id:"number",get players(){var e=[],t=this;return["player1","player2","player3","player4"].map(function(n){t[n]&&e.push(t[n])}),new s.List(e)}});c.List=u.extend("TeamsList",{"#":c,get idMap(){var e={};return this.each(function(t){e[t.id]=t}),e},removeById:function(e){for(var t=0;t<this.length;)this[t].id===e?this.splice(t,1):t++},getById:function(e){return this.idMap[e]}}),c.algebra=new i.Algebra(new i.Translate("where","where"),i.comparators.sort("sortBy")),r("team-model",a({Map:c,List:c.List,url:{resource:"/services/teams",contentType:"application/x-www-form-urlencoded"},name:"team",algebra:c.algebra})),n.exports=c}),define("bitballs@0.4.0#models/stat",["exports","can-connect/can/super-map/","can-connect/can/tag/","can-set","can-define/map/map","can-define/list/list","bitballs/models/player","can-define-backup"],function(e,t,n,a,r,i,s){"use strict";function o(e){return e&&e.__esModule?e:{default:e}}function u(e){if(Array.isArray(e)){for(var t=0,n=Array(e.length);t<e.length;t++)n[t]=e[t];return n}return Array.from(e)}Object.defineProperty(e,"__esModule",{value:!0});var c=o(t),m=o(n),d=o(a),l=o(r),f=o(i),p=o(s),b=l.default.extend("Stat",{statTypes:[{name:"1P"},{name:"1PA"},{name:"2P"},{name:"2PA"},{name:"ORB"},{name:"DRB"},{name:"Ast"},{name:"Stl"},{name:"Blk"},{name:"To"}]},{id:"number",player:{Type:p.default,serialize:!1},playerId:"number",gameId:"number",type:"any",time:{set:function(e){return Math.round(e)}}});b.List=f.default.extend("StatsList",{"#":b,get byPlayer(){var e={};return this.forEach(function(t){e[t.playerId]||(e[t.playerId]=new b.List),e[t.playerId].push(t)}),e},get players(){return Object.keys(this.byPlayer).map(function(e){return{id:e}})},get byGame(){var e={};return this.forEach(function(t){e[t.gameId]||(e[t.gameId]=new b.List),e[t.gameId].push(t)}),e},get games(){return Object.keys(this.byGame).map(function(e){return{id:e}})},get aggregated(){var e={};return this.forEach(function(t){var n=t.type;e[n]||(e[n]=0),e[n]++}),[].concat(u(b.statTypes.map(function(t){var n=t.name;return{name:n,value:(e[n]||0).toFixed(0)}})),[{name:"TP",value:function(){return((e["1P"]||0)+2*(e["2P"]||0)).toFixed(0)}()},{name:"FG%",value:function(){var t=e["1P"]||0,n=e["2P"]||0,a=e["1PA"]||0,r=e["2PA"]||0,i=t+n,s=a+r,o=i/(i+s);return isNaN(o)?"-":(100*o).toFixed(0)+"%"}()}])}}),b.algebra=new d.default.Algebra(new d.default.Translate("where","where"),d.default.comparators.sort("sortBy")),b.connection=(0,c.default)({idProp:"id",Map:b,List:b.List,url:{resource:"/services/stats",contentType:"application/x-www-form-urlencoded"},name:"stat",algebra:b.algebra}),(0,m.default)("stat-model",b.connection),e.default=b}),define("can-util@3.8.4#js/omit/omit",function(e,t,n){"use strict";n.exports=function(e,t){var n={};for(var a in e)t.indexOf(a)<0&&(n[a]=e[a]);return n}}),define("can-util@3.8.4#dom/dom",function(e,t,n){!function(t){"use strict";n.exports={ajax:e("./ajax/ajax"),attr:e("./attr/attr"),childNodes:e("./child-nodes/child-nodes"),className:e("./class-name/class-name"),contains:e("./contains/contains"),data:e("./data/data"),dispatch:e("./dispatch/dispatch"),document:e("./document/document"),events:e("./events/events"),frag:e("./frag/frag"),fragment:e("./fragment/fragment"),isOfGlobalDocument:e("./is-of-global-document/is-of-global-document"),matches:e("./matches/matches"),mutate:e("./mutate/mutate"),mutationObserver:e("./mutation-observer/mutation-observer")}}()}),define("can-util@3.8.4#js/is-string/is-string",function(e,t,n){"use strict";n.exports=function(e){return"string"==typeof e}}),define("can-util@3.8.4#js/js",function(e,t,n){!function(t){"use strict";n.exports={assign:e("./assign/assign"),cid:e("can-cid"),deepAssign:e("./deep-assign/deep-assign"),dev:e("./dev/dev"),diff:e("./diff/diff"),each:e("./each/each"),global:e("./global/global"),import:e("./import/import"),isArray:e("./is-array/is-array"),isArrayLike:e("./is-array-like/is-array-like"),isBrowserWindow:e("./is-browser-window/is-browser-window"),isEmptyObject:e("./is-empty-object/is-empty-object"),isFunction:e("./is-function/is-function"),isNode:e("./is-node/is-node"),isPlainObject:e("./is-plain-object/is-plain-object"),isPromise:e("./is-promise/is-promise"),isString:e("./is-string/is-string"),isWebWorker:e("./is-web-worker/is-web-worker"),joinURIs:e("./join-uris/join-uris"),last:e("./last/last"),makeArray:e("./make-array/make-array"),omit:e("./omit/omit"),setImmediate:e("./set-immediate/set-immediate"),string:e("./string/string"),types:e("can-types")}}()}),define("can-util@3.8.4#can-util",function(e,t,n){var a=e("./js/deep-assign/deep-assign"),r=e("./js/omit/omit"),i=e("can-namespace");n.exports=a(i,e("./dom/dom"),r(e("./js/js"),["cid","types"]))}),define("bitballs@0.4.0#models/game",function(e,t,n){var a=e("can-connect/can/super-map/"),r=e("can-set"),i=e("can-connect/can/tag/"),s=e("bitballs/models/team"),o=e("bitballs/models/player"),u=e("bitballs/models/stat").default,c=e("./tournament"),m=e("can-define/map/map"),d=e("can-define/list/list"),l=e("can-util"),f=m.extend("Game",{courtNames:["1","2","3","4"],roundNames:["Round 1","Round 2","Round 3","Round 4","Round 5","Elimination","Quarter Finals","Semi Finals","Championship"]},{id:"number",tournamentId:"number",tournament:c,homeTeamId:"number",awayTeamId:"number",homeTeam:s,awayTeam:s,round:"string",court:"string",get teams(){var e=[],t=this.homeTeam,n=this.awayTeam;return t&&e.push(t),n&&e.push(n),new s.List(e)},get players(){var e=[];return this.teams.forEach(function(t){[].push.apply(e,l.makeArray(t.players))}),new o.List(e)},stats:{Type:u.List,set:function(e){return e&&(e.__listSet={where:{gameId:this.id}}),e}},videoUrl:{set:function(e){var t=/^.*(?:youtu.be\/|v\/|e\/|u\/\w+\/|embed\/|v=)([^#\&\?]*).*/,n=e&&e.match(t);return n&&n.length>1&&n[1]||e}},statsForPlayerId:function(e){return this.stats.filter(function(t){return t.playerId===e})},sortedStatsByPlayerId:function(){if(this.stats){var e={};return this.stats.forEach(function(t){var n=t.playerId,a=e[n];a||(a=new d,a.comparator="time",e[n]=a),a.push(t)}),e}}});f.List=d.extend("GamesList",{"#":f,get gamesGroupedByRound(){var e={};return this.forEach(function(t){var n=t.round,a=t.court;e[n]=e[n]||{_count:0},e[n][a]=t,e[n]._count++}),e},getGameCountForRound:function(e){var t=this.gamesGroupedByRound,n=t[e];return n?n._count:0},getAvailableRounds:function(){return f.roundNames.filter(function(e){return this.getGameCountForRound(e)<f.courtNames.length},this)},getRoundsWithGames:function(){return f.roundNames.filter(function(e){return this.getGameCountForRound(e)>0},this)},getAvailableCourts:function(e){return f.courtNames.filter(function(t){return!this.getGameForRoundAndCourt(e,t)},this)},getGameForRoundAndCourt:function(e,t){var n=this.gamesGroupedByRound,a=n[e];return a&&a[t]}}),f.algebra=new r.Algebra(new r.Translate("where","where"),r.comparators.sort("sortBy")),f.connection=a({Map:f,List:f.List,url:{resource:"/services/games",contentType:"application/x-www-form-urlencoded"},name:"game",algebra:f.algebra}),i("game-model",f.connection),n.exports=f});