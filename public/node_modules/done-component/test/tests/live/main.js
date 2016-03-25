require("./foo.component!");
var stache = require("can/view/stache/");
var can = require("can");

can.$("#app").html(stache("<foo-bar></foo-bar>"));
