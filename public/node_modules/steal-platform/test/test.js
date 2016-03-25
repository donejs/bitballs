var platform = require("steal-platform");

var list = document.getElementById("top");

Object.keys(platform).forEach(function(key){
	var item = document.createElement("li");
	var val = platform[key];

	if(typeof val === "boolean") {
		var txt = key + ": " + val;
		item.textContent = txt;

		list.appendChild(item);
	}
});
