
module.exports = function(grunt){
	grunt.initConfig({
		copy: {
			toTest: {
				files: [{
					expand: true,
					src:["node_modules/can/**"],
					dest: "test/tests/ssr",
					filter: "isFile"
				}, {
					expand: true,
					src:["node_modules/jquery/**"],
					dest: "test/tests/ssr",
					filter: "isFile"

				}, {
					expand: true,
					src:["node_modules/done-autorender/**"],
					dest: "test/tests/ssr",
					filter: "isFile"
				},{
					expand: true,
					src:["node_modules/can-ssr/**"],
					dest: "test/tests/ssr",
					filter: "isFile"
				},{
					expand: true,
					src:["node_modules/done-css/**"],
					dest: "test/tests/ssr",
					filter: "isFile"
				}]
			}

		},
		testee: {
		  tests: {
			options: {
			  browsers: ["firefox"]
			},
			src: ["test/test.html"]
		  }
		}
	});

	grunt.loadNpmTasks("testee");
	grunt.loadNpmTasks("grunt-contrib-copy");

	grunt.registerTask("test", ["testee"]);
};
