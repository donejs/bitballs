define([
	"@loader",
	"module",
	"./parse",
	"./template",
	"can/view/stache/add_bundles",
	"can-zone",
], function(loader, module, parse, template, addBundles){
	var main;

	var isNode = typeof process === "object" &&
		{}.toString.call(process) === "[object process]";

	if(!isNode) {
		steal.done().then(setup);
	}

	function setup(){
		loader.import(loader.main).then(function(r){
			main = r;
			liveReload();
		});
	}

	function liveReload(){
		if(!loader.has("live-reload")) {
			return;
		}

		loader.import("live-reload", { name: module.id }).then(function(reload){
			loader.normalize(loader.main).then(function(mainName){
				reload(function(){
					main.rerender();
				});

				reload(mainName, function(r){
					main = r;
				});
			});
		});
	}

	function translate(load){
		var result = parse(load.source, this);

		return Promise.all([
			addBundles(result.dynamicImports, load.name),
			Promise.all(result.imports)
		]).then(function(pResults){
			var output = template({
				imports: JSON.stringify(pResults[1]),
				args: result.args.join(", "),
				intermediate: JSON.stringify(result.intermediate),
				ases: can.map(result.ases, function(from, name){
					return "\t" + name + ": " + name +"['default'] || " + name;
				}).join(",\n")
			});

			return output;
		});
	}

  return {
    translate: translate
  };
});
