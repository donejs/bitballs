"format cjs";

var loader = require("@loader");

loader.renderingLoader = loader.clone();
loader.renderingLoader.baseURL = "http://example.com/app";
