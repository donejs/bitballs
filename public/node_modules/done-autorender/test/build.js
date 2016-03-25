var stealTools = require("steal-tools");

stealTools.build({
	config: __dirname + "/../package.json!npm",
	main: "test/basics/index.stache!done-autorender",
	bundlesPath: "test/basics/dist/bundles"
}, {
	quiet: true
});
