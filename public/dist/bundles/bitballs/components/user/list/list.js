define("bitballs@0.3.1#components/user/list/list.stache!steal-stache@3.0.7#steal-stache",["module","can-stache","can-stache/src/mustache_core","can-view-import@3.0.7#can-view-import","can-stache-bindings@3.1.6#can-stache-bindings"],function(e,t,s){var a=t([{tokenType:"special",args:["#session.isAdmin"]},{tokenType:"chars",args:["  "]},{tokenType:"start",args:["table",!1]},{tokenType:"attrStart",args:["class"]},{tokenType:"attrValue",args:["table"]},{tokenType:"attrEnd",args:["class"]},{tokenType:"end",args:["table",!1]},{tokenType:"chars",args:["\n    "]},{tokenType:"start",args:["thead",!1]},{tokenType:"end",args:["thead",!1]},{tokenType:"chars",args:["\n      "]},{tokenType:"start",args:["tr",!1]},{tokenType:"end",args:["tr",!1]},{tokenType:"chars",args:["\n        "]},{tokenType:"start",args:["th",!1]},{tokenType:"end",args:["th",!1]},{tokenType:"chars",args:["Id"]},{tokenType:"close",args:["th"]},{tokenType:"chars",args:["\n        "]},{tokenType:"start",args:["th",!1]},{tokenType:"end",args:["th",!1]},{tokenType:"chars",args:["Email"]},{tokenType:"close",args:["th"]},{tokenType:"chars",args:["\n        "]},{tokenType:"start",args:["th",!1]},{tokenType:"end",args:["th",!1]},{tokenType:"chars",args:["Verified"]},{tokenType:"close",args:["th"]},{tokenType:"chars",args:["\n        "]},{tokenType:"start",args:["th",!1]},{tokenType:"end",args:["th",!1]},{tokenType:"chars",args:["Is Admin"]},{tokenType:"close",args:["th"]},{tokenType:"chars",args:["\n      "]},{tokenType:"close",args:["tr"]},{tokenType:"chars",args:["\n    "]},{tokenType:"close",args:["thead"]},{tokenType:"chars",args:["\n    "]},{tokenType:"start",args:["tbody",!1]},{tokenType:"end",args:["tbody",!1]},{tokenType:"special",args:["#if users.isPending"]},{tokenType:"chars",args:["\n        "]},{tokenType:"start",args:["tr",!1]},{tokenType:"attrStart",args:["class"]},{tokenType:"attrValue",args:["info"]},{tokenType:"attrEnd",args:["class"]},{tokenType:"end",args:["tr",!1]},{tokenType:"chars",args:["\n          "]},{tokenType:"start",args:["td",!1]},{tokenType:"attrStart",args:["colspan"]},{tokenType:"attrValue",args:["4"]},{tokenType:"attrEnd",args:["colspan"]},{tokenType:"end",args:["td",!1]},{tokenType:"chars",args:["LOADING..."]},{tokenType:"close",args:["td"]},{tokenType:"chars",args:["\n        "]},{tokenType:"close",args:["tr"]},{tokenType:"special",args:["/if"]},{tokenType:"chars",args:["\n      "]},{tokenType:"special",args:["#if users.isResolved"]},{tokenType:"special",args:["#each users.value"]},{tokenType:"chars",args:["\n          "]},{tokenType:"start",args:["tr",!1]},{tokenType:"end",args:["tr",!1]},{tokenType:"chars",args:["\n            "]},{tokenType:"start",args:["td",!1]},{tokenType:"end",args:["td",!1]},{tokenType:"special",args:["id"]},{tokenType:"close",args:["td"]},{tokenType:"chars",args:["\n            "]},{tokenType:"start",args:["td",!1]},{tokenType:"end",args:["td",!1]},{tokenType:"special",args:["email"]},{tokenType:"close",args:["td"]},{tokenType:"chars",args:["\n            "]},{tokenType:"start",args:["td",!1]},{tokenType:"end",args:["td",!1]},{tokenType:"special",args:["verified"]},{tokenType:"close",args:["td"]},{tokenType:"chars",args:["\n            "]},{tokenType:"start",args:["td",!1]},{tokenType:"end",args:["td",!1]},{tokenType:"special",args:["#is id session.user.id"]},{tokenType:"chars",args:["\n                "]},{tokenType:"special",args:["isAdmin"]},{tokenType:"chars",args:["              "]},{tokenType:"special",args:["else"]},{tokenType:"chars",args:["\n                "]},{tokenType:"start",args:["input",!0]},{tokenType:"attrStart",args:["type"]},{tokenType:"attrValue",args:["checkbox"]},{tokenType:"attrEnd",args:["type"]},{tokenType:"attrStart",args:["($change)"]},{tokenType:"attrValue",args:["setAdmin( ., %element.checked )"]},{tokenType:"attrEnd",args:["($change)"]},{tokenType:"attrStart",args:["{$checked}"]},{tokenType:"attrValue",args:["isAdmin"]},{tokenType:"attrEnd",args:["{$checked}"]},{tokenType:"attrStart",args:["{$disabled}"]},{tokenType:"attrValue",args:["isSaving"]},{tokenType:"attrEnd",args:["{$disabled}"]},{tokenType:"end",args:["input",!0]},{tokenType:"special",args:["/is"]},{tokenType:"chars",args:["\n            "]},{tokenType:"close",args:["td"]},{tokenType:"chars",args:["\n          "]},{tokenType:"close",args:["tr"]},{tokenType:"special",args:["/each"]},{tokenType:"chars",args:["\n      "]},{tokenType:"special",args:["/if"]},{tokenType:"chars",args:["\n    "]},{tokenType:"close",args:["tbody"]},{tokenType:"chars",args:["\n  "]},{tokenType:"close",args:["table"]},{tokenType:"special",args:["/session.isAdmin"]},{tokenType:"done",args:[]}]);return function(t,n,r){var o={module:e};return n instanceof s.Options||(n=new s.Options(n||{})),a(t,n.add(o),r)}}),define("bitballs@0.3.1#components/user/list/list",["exports","can-component","can-define/map/map","./list.stache!","bitballs/models/user","bitballs/models/session","./list.less!"],function(e,t,s,a,n,r){"use strict";function o(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(e,"__esModule",{value:!0}),e.ViewModel=void 0;var p=o(t),g=o(s),y=o(a),k=o(n),T=o(r),c=e.ViewModel=g.default.extend({session:T.default,users:{get:function(e){return e||k.default.getList({})}},setAdmin:function(e,t){return e.isAdmin=t,e.save()}});e.default=p.default.extend({tag:"user-list",ViewModel:c,view:y.default})});