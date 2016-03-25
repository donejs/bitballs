var assert = require('assert');
var fs = require('fs');
var path = require('path');
var Q = require('q');
var utils = require('../lib/utils');

function fail(error) {
  console.error(error.stack);
  throw error;
}

var isCI = require('is-ci');
var isWindows = require('os').platform() === 'win32';
// change the current working directory to "test" where the .yo-rc.json
// and the package.json is located
var testDir = path.join(process.cwd(), 'test');
process.chdir(testDir);

describe('DoneJS CLI tests', function () {
  describe('utils', function () {
    before(function () {
      delete global.donejsTestPluginLoaded;
    });

    it('installIfMissing', function (done) {
      Q.resolve(utils.installIfMissing('day-seconds')())
      .then(function () {
        var daySeconds = require('day-seconds');
        assert.equal(daySeconds(true), 86400, 'day-second module installed and loaded');
        done();
      })
      .fail(fail);
    });

    describe('add', function () {
      it('default generator', function (done) {
        utils.add(path.join(process.cwd(), 'node_modules'), 'test-plugin', [])
        .then(function () {
          assert.equal(global.donejsTestPluginLoaded, 'default', 'donejs-test-plugin other generator is executed');
          done();
        })
        .fail(fail);
      });

      it('non-default generator', function (done) {
        utils.add(path.join(process.cwd(), 'node_modules'), 'test-plugin', [['other']])
        .then(function () {
          assert.equal(global.donejsTestPluginLoaded, 'other', 'donejs-test-plugin default generator is executed');
          done();
        })
        .fail(fail);
      });

      it('non-default generator with params', function (done) {
        utils.add(path.join(process.cwd(), 'node_modules'), 'test-plugin', [['other', 'foo']])
        .then(function () {
          assert.equal(global.donejsTestPluginLoaded, 'foo', 'donejs-test-plugin other generator is executed with correct params');
          done();
        })
        .fail(fail);
      });
    });

    it('runScript and runCommand', function (done) {
      utils.runScript('verify', ['testing', 'args']).then(function (child) {
        assert.equal(child.exitCode, 0, 'Exited successfully');
        done();
      })
      .fail(fail);
    });

    it('generate .component', function (done) {
      var moduleName = 'dummy/component.component';
      var root = path.join(process.cwd(), 'node_modules');
      var generatedPath = path.join(testDir, moduleName);

      utils.generate(root, 'generator-donejs', [
        ['component', moduleName, 'dummy-component']
      ])
      .then(function () {
        fs.exists(generatedPath, function (exists) {
          assert.ok(exists, 'Component file generate');
          done();
        });
      })
      .fail(fail);
    });

    var runCommandPassesStdio = function (done) {
      var script = __dirname + "/tests/needstty.js";
      var makeAssert = function (val, msg) {
        return function (err) {
          if (!val && err) {
            console.error(err);
          }
          assert(val, msg);
        };
      };
      utils.runCommand("node", [script])
      .then(makeAssert(true, "Script was ran as a tty"),
        makeAssert(false, "Script not run as a tty"))
      .then(done, done);
    };

    // This test doesn't pass in AppVeyor but does pass when ran locally on Windows
    // Giving up on CI for this for right now.
    if (isWindows && isCI) {
      it.skip("runCommand passes stdio for scripts that need a tty", runCommandPassesStdio);
    } else {
      it("runCommand passes stdio for scripts that need a tty", runCommandPassesStdio);
    }

    it("gets the npm version", function (done) {
      utils.npmVersion().then(function (version) {
        assert.equal(typeof version.major, "number", "the major version is a number");
        assert.equal(typeof version.minor, "number", "the minor version is a number");
        assert.equal(typeof version.patch, "string", "the patch version is a string");
      }).then(done, done);
    });

  });

  describe('project root', function () {
    it('get project root when it is current folder', function (done) {
      var pathFromTest = process.cwd();
      utils.projectRoot().then(function (p) {
        assert.equal(p, pathFromTest);
        done();
      })
      .fail(done);
    });
  });
});
