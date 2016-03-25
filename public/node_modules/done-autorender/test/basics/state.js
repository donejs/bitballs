define(["can/map/map", "can/route/route"], function(Map){
	return Map.extend({
		hello: function(){
			return "world";
		}
	});
});
