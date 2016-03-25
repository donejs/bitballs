define(["can/map/map", "can/map/define/define", "can/route/route"], function(Map){
	return Map.extend({
		define: {
			stuff: {
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
	});
});
