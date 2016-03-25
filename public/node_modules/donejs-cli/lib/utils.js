var Q = require('q');
var debug = require('debug')('donejs-cli:utils');
var path = require('path');
var fs = require('fs');
var spawn = require('cross-spawn-async');
var yeoman = require('yeoman-environment');

exports.projectRoot = function() {
  var root = process.cwd();
  var current = root;

  while(current && !fs.existsSync(path.join(current, 'node_modules')) ) {
    if(current === path.dirname(current)) {
      debug('Returning cwd project root', root);
      return Q(root);
    }

    current = path.dirname(current);
  }

  debug('Found project root', current);
  return Q(current || root);
};

// Run a command and pipe the output.
// The returned promise will reject if there is a non-zero exist status
var runCommand = exports.runCommand = function(cmd, args) {
  var child = spawn(cmd, args, {
    cwd: process.cwd(),
    stdio: "inherit"
  });

  var deferred = Q.defer();

  child.on('exit', function(status) {
    if(status) {
      deferred.reject(new Error('Command `' + cmd + '` did not complete successfully'));
    } else {
      deferred.resolve(child);
    }
  });

  return deferred.promise;
};

// Returns a .then-able function that installs a single module
// if it is not available in the current path
var installIfMissing = exports.installIfMissing = function(root, module) {
  var location = module ? path.join(root, module) : root;
  if(!module) {
    module = root;
  }
  debug('Looking for and installing if missing', module);
  return function (previous) {
    try {
      require.resolve(location);
    } catch (e) {
      console.log('Installing ' + module);
      return runCommand('npm', ['install', module, '--loglevel', 'error']).then(function () {
        return previous;
      });
    }

    return previous;
  };
};

// Run any of the Yeoman generators from the current generator-donejs
var generate = exports.generate = function(root, generator, args) {
  return Q.resolve(installIfMissing(root, generator)())
    .then(function () {
      var generators = require(path.join(root, generator));
      var env = yeoman.createEnv();

      Object.keys(generators).forEach(function(name) {
          var fullName = path.join(root, generator, name);
          debug('Registering generator', fullName);
          env.register(require.resolve(fullName), name);
      });

      return Q.npost(env, 'run', args);
    });
};

// Add a module from npm and run its default export
exports.add = function(root, name, params) {
  var generatorName = 'donejs-' + name;
  params = (params && params.length) ? params : ['default'];

  debug('Adding', generatorName, params);
  return generate(root, generatorName, params);
};

exports.runScript = function(name, args) {
  debug('Running npm script', name, args);
  return runCommand('npm', ['run', name].concat(args || []));
};

// Log error messages and exit application
exports.log = function(promise) {
  return promise.then(function() {
    process.exit(0);
  }, function(error) {
    console.error(error.stack || error.message || error);
    process.exit(1);
  });
};

exports.npmVersion = function(){
    var child = spawn('npm', ['--version'], {
    cwd: process.cwd()
  });

  var deferred = Q.defer();
  var version = '';
  var getVersion = function(d){
    version = d.toString();
  };

  child.stdout.on('data', getVersion);

  child.on('exit', function() {
    var parts = version.trim().split(".");
    deferred.resolve({
      major: +parts[0],
      minor: +parts[1],
      patch: parts[1]
    });
  });

  return deferred.promise;
};
