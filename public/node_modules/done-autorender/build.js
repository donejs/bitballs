var template = require("lodash.template");
var fs = require("fs");

var str = fs.readFileSync(__dirname + "/src/template.txt");

var fn = template(str);

var out = "def" + "ine([], function(){\n" +
	"\treturn " + fn.source +
	"\n});";

fs.writeFileSync(__dirname + "/src/template.js", out, "utf8");
