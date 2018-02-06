var path = require("path");
var stealTools = require("steal-tools");

var config = {
  config: path.join(__dirname, "package.json!npm")
};

module.exports = stealTools
  .build(config, {
    bundleAssets: true
  })
  .then(function() {
    return stealTools.optimize(config, {
      target: 'web',
      bundleAssets: true
    });
  });
