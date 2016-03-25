define([
	"can/map/map",
	"@loader",
	"can/route/route"
], function(Map, loader){
	return Map.extend({
		bundles: function(){
			return loader.bundle;
		},
		hello: function(){
			return "world";
		}
	});
});
