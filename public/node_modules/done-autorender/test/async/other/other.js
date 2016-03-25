var can = require("can");
require("can/map/define/");

can.Component.extend({
	tag: "other-page",
	template: require("./other.stache!"),
	viewModel: {
		define: {
		things: {
			Value: can.List,
			get: function(list){
				var xhr = new XMLHttpRequest();
				xhr.open("GET", "foo://bar");
				xhr.onload = function(){
					var data = JSON.parse(xhr.responseText);
					list.replace(data);
				};
				xhr.send();
				return list;
			}
		}
		}
	}
});
