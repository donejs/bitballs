define([
	"module",
	"can/view/stache/intermediate_and_imports"
], function(module, getIntermediateAndImports){

	return function(source, loader){
		var intermediateAndImports = getIntermediateAndImports(source);

		var ases = intermediateAndImports.ases;
		var imports = intermediateAndImports.imports;
		var args = [];
		can.each(ases, function(from, name){
			// Move the as to the front of the array.
			imports.splice(imports.indexOf(from), 1);
			imports.unshift(from);

			// Get rid of @ character for the viewModel
			if(name[0] === "@") {
				name = name.substr(1);
			}
			args.unshift(name);
		});

		var params = [
			["can/util/util", "can"],
			[loader.normalize("can-zone", module.id), "Zone"],
			[loader.normalize("can-zone/xhr", module.id), "xhrZone"],
			["can/view/stache/stache", "stache"],
			["module", "module"]
		];

		can.each(params, function(param){
			imports.unshift(param[0]);
			args.unshift(param[1]);
		});

		return {
			imports: imports,
			dynamicImports: intermediateAndImports.dynamicImports,
			args: args,
			ases: ases,
			intermediate: intermediateAndImports.intermediate
		};
	};

});
