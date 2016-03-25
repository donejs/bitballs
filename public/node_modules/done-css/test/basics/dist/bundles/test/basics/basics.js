/*[system-bundles-config]*/
System.bundles = {"bundles/test/basics/basics.css!":["test/basics/style.css!$css"]};
System.config({
	paths: {
		"$css": "css.js"
	}
});
/*npm-utils*/
define('npm-utils', function (require, exports, module) {
    var npmModuleRegEx = /.+@.+\..+\..+#.+/;
    var utils = {
            extend: function (d, s) {
                for (var prop in s) {
                    d[prop] = s[prop];
                }
                return d;
            },
            map: function (arr, fn) {
                var i = 0, len = arr.length, out = [];
                for (; i < len; i++) {
                    out.push(fn.call(arr, arr[i]));
                }
                return out;
            },
            filter: function (arr, fn) {
                var i = 0, len = arr.length, out = [], res;
                for (; i < len; i++) {
                    res = fn.call(arr, arr[i]);
                    if (res) {
                        out.push(res);
                    }
                }
                return out;
            },
            forEach: function (arr, fn) {
                var i = 0, len = arr.length;
                for (; i < len; i++) {
                    fn.call(arr, arr[i], i);
                }
            },
            moduleName: {
                create: function (descriptor, standard) {
                    if (standard) {
                        return descriptor.moduleName;
                    } else {
                        if (descriptor === '@empty') {
                            return descriptor;
                        }
                        var modulePath;
                        if (descriptor.modulePath) {
                            modulePath = descriptor.modulePath.substr(0, 2) === './' ? descriptor.modulePath.substr(2) : descriptor.modulePath;
                        }
                        return descriptor.packageName + (descriptor.version ? '@' + descriptor.version : '') + (modulePath ? '#' + modulePath : '') + (descriptor.plugin ? descriptor.plugin : '');
                    }
                },
                isNpm: function (moduleName) {
                    return npmModuleRegEx.test(moduleName);
                },
                parse: function (moduleName, currentPackageName) {
                    var pluginParts = moduleName.split('!');
                    var modulePathParts = pluginParts[0].split('#');
                    var versionParts = modulePathParts[0].split('@');
                    if (!modulePathParts[1] && !versionParts[0]) {
                        versionParts = ['@' + versionParts[1]];
                    }
                    var packageName, modulePath;
                    if (currentPackageName && utils.path.isRelative(moduleName)) {
                        packageName = currentPackageName;
                        modulePath = versionParts[0];
                    } else {
                        if (modulePathParts[1]) {
                            packageName = versionParts[0];
                            modulePath = modulePathParts[1];
                        } else {
                            var folderParts = versionParts[0].split('/');
                            packageName = folderParts.shift();
                            modulePath = folderParts.join('/');
                        }
                    }
                    return {
                        plugin: pluginParts.length === 2 ? '!' + pluginParts[1] : undefined,
                        version: versionParts[1],
                        modulePath: modulePath,
                        packageName: packageName,
                        moduleName: moduleName
                    };
                },
                parseFromPackage: function (loader, refPkg, name, parentName) {
                    var packageName = utils.pkg.name(refPkg), parsedModuleName = utils.moduleName.parse(name, packageName);
                    if (utils.path.isRelative(parsedModuleName.modulePath)) {
                        var parentParsed = utils.moduleName.parse(parentName, packageName);
                        if (parentParsed.packageName === parsedModuleName.packageName && parentParsed.modulePath) {
                            parsedModuleName.modulePath = utils.path.makeRelative(utils.path.joinURIs(parentParsed.modulePath, parsedModuleName.modulePath));
                        }
                    }
                    var mapName = utils.moduleName.create(parsedModuleName), mappedName;
                    if (refPkg.browser && typeof refPkg.browser !== 'string' && mapName in refPkg.browser && (!refPkg.system || !refPkg.system.ignoreBrowser)) {
                        mappedName = refPkg.browser[mapName] === false ? '@empty' : refPkg.browser[mapName];
                    }
                    var global = loader && loader.globalBrowser && loader.globalBrowser[mapName];
                    if (global) {
                        mappedName = global.moduleName === false ? '@empty' : global.moduleName;
                    }
                    if (mappedName) {
                        return utils.moduleName.parse(mappedName, packageName);
                    } else {
                        return parsedModuleName;
                    }
                }
            },
            pkg: {
                name: function (pkg) {
                    return pkg.system && pkg.system.name || pkg.name;
                },
                main: function (pkg) {
                    return utils.path.removeJS(pkg.system && pkg.system.main || typeof pkg.browser === 'string' && pkg.browser || pkg.main || 'index');
                },
                rootDir: function (pkg, isRoot) {
                    var root = isRoot ? utils.path.removePackage(pkg.fileUrl) : utils.path.pkgDir(pkg.fileUrl);
                    var lib = pkg.system && pkg.system.directories && pkg.system.directories.lib;
                    if (lib) {
                        root = utils.path.joinURIs(utils.path.addEndingSlash(root), lib);
                    }
                    return root;
                },
                findByModuleNameOrAddress: function (loader, moduleName, moduleAddress) {
                    if (loader.npm) {
                        if (moduleName) {
                            var parsed = utils.moduleName.parse(moduleName);
                            if (parsed.version && parsed.packageName) {
                                var name = parsed.packageName + '@' + parsed.version;
                                if (name in loader.npm) {
                                    return loader.npm[name];
                                }
                            }
                        }
                        if (moduleAddress) {
                            var packageFolder = utils.pkg.folderAddress(moduleAddress);
                            return packageFolder ? loader.npmPaths[packageFolder] : loader.npmPaths.__default;
                        } else {
                            return loader.npmPaths.__default;
                        }
                    }
                },
                folderAddress: function (address) {
                    var nodeModules = '/node_modules/', nodeModulesIndex = address.lastIndexOf(nodeModules), nextSlash = address.indexOf('/', nodeModulesIndex + nodeModules.length);
                    if (nodeModulesIndex >= 0) {
                        return nextSlash >= 0 ? address.substr(0, nextSlash) : address;
                    }
                },
                findDep: function (loader, refPackage, name) {
                    if (loader.npm && refPackage && !utils.path.startsWithDotSlash(name)) {
                        var curPackage = utils.path.depPackageDir(refPackage.fileUrl, name);
                        while (curPackage) {
                            var pkg = loader.npmPaths[curPackage];
                            if (pkg) {
                                return pkg;
                            }
                            var parentAddress = utils.path.parentNodeModuleAddress(curPackage);
                            if (!parentAddress) {
                                return;
                            }
                            curPackage = parentAddress + '/' + name;
                        }
                    }
                },
                findByName: function (loader, name) {
                    if (loader.npm && !utils.path.startsWithDotSlash(name)) {
                        return loader.npm[name];
                    }
                },
                hasDirectoriesLib: function (pkg) {
                    var system = pkg.system;
                    return system && system.directories && !!system.directories.lib;
                }
            },
            path: {
                makeRelative: function (path) {
                    if (utils.path.isRelative(path) && path.substr(0, 1) !== '/') {
                        return path;
                    } else {
                        return './' + path;
                    }
                },
                removeJS: function (path) {
                    return path.replace(/\.js(!|$)/, function (whole, part) {
                        return part;
                    });
                },
                removePackage: function (path) {
                    return path.replace(/\/package\.json.*/, '');
                },
                addJS: function (path) {
                    if (/\.js(on)?$/.test(path)) {
                        return path;
                    } else {
                        return path + '.js';
                    }
                },
                isRelative: function (path) {
                    return path.substr(0, 1) === '.';
                },
                joinURIs: function (base, href) {
                    function removeDotSegments(input) {
                        var output = [];
                        input.replace(/^(\.\.?(\/|$))+/, '').replace(/\/(\.(\/|$))+/g, '/').replace(/\/\.\.$/, '/../').replace(/\/?[^\/]*/g, function (p) {
                            if (p === '/..') {
                                output.pop();
                            } else {
                                output.push(p);
                            }
                        });
                        return output.join('').replace(/^\//, input.charAt(0) === '/' ? '/' : '');
                    }
                    href = parseURI(href || '');
                    base = parseURI(base || '');
                    return !href || !base ? null : (href.protocol || base.protocol) + (href.protocol || href.authority ? href.authority : base.authority) + removeDotSegments(href.protocol || href.authority || href.pathname.charAt(0) === '/' ? href.pathname : href.pathname ? (base.authority && !base.pathname ? '/' : '') + base.pathname.slice(0, base.pathname.lastIndexOf('/') + 1) + href.pathname : base.pathname) + (href.protocol || href.authority || href.pathname ? href.search : href.search || base.search) + href.hash;
                },
                startsWithDotSlash: function (path) {
                    return path.substr(0, 2) === './';
                },
                endsWithSlash: function (path) {
                    return path[path.length - 1] === '/';
                },
                addEndingSlash: function (path) {
                    return utils.path.endsWithSlash(path) ? path : path + '/';
                },
                depPackage: function (parentPackageAddress, childName) {
                    var packageFolderName = parentPackageAddress.replace(/\/package\.json.*/, '');
                    return (packageFolderName ? packageFolderName + '/' : '') + 'node_modules/' + childName + '/package.json';
                },
                depPackageDir: function (parentPackageAddress, childName) {
                    return utils.path.depPackage(parentPackageAddress, childName).replace(/\/package\.json.*/, '');
                },
                parentNodeModuleAddress: function (address) {
                    var nodeModules = '/node_modules/', nodeModulesIndex = address.lastIndexOf(nodeModules), prevModulesIndex = address.lastIndexOf(nodeModules, nodeModulesIndex - 1);
                    if (prevModulesIndex >= 0) {
                        return address.substr(0, prevModulesIndex + nodeModules.length - 1);
                    }
                },
                pkgDir: function (address) {
                    var nodeModules = '/node_modules/', nodeModulesIndex = address.lastIndexOf(nodeModules), nextSlash = address.indexOf('/', nodeModulesIndex + nodeModules.length);
                    if (nodeModulesIndex >= 0) {
                        return nextSlash >= 0 ? address.substr(0, nextSlash) : address;
                    }
                }
            },
            includeInBuild: true
        };
    function parseURI(url) {
        var m = String(url).replace(/^\s+|\s+$/g, '').match(/^([^:\/?#]+:)?(\/\/(?:[^:@]*(?::[^:@]*)?@)?(([^:\/?#]*)(?::(\d*))?))?([^?#]*)(\?[^#]*)?(#[\s\S]*)?/);
        return m ? {
            href: m[0] || '',
            protocol: m[1] || '',
            authority: m[2] || '',
            host: m[3] || '',
            hostname: m[4] || '',
            port: m[5] || '',
            pathname: m[6] || '',
            search: m[7] || '',
            hash: m[8] || ''
        } : null;
    }
    module.exports = utils;
});
/*npm-extension*/
define('npm-extension', function (require, exports, module) {
    'format cjs';
    var utils = require('./npm-utils');
    exports.includeInBuild = true;
    exports.addExtension = function (System) {
        var oldNormalize = System.normalize;
        System.normalize = function (name, parentName, parentAddress, pluginNormalize) {
            if (parentName && utils.path.isRelative(name) && !utils.moduleName.isNpm(parentName)) {
                return oldNormalize.call(this, name, parentName, parentAddress);
            }
            var refPkg = utils.pkg.findByModuleNameOrAddress(this, parentName, parentAddress);
            if (!refPkg) {
                return oldNormalize.call(this, name, parentName, parentAddress);
            }
            var parsedModuleName = utils.moduleName.parseFromPackage(this, refPkg, name, parentName);
            var depPkg = utils.pkg.findDep(this, refPkg, parsedModuleName.packageName);
            if (!depPkg) {
                depPkg = utils.pkg.findByName(this, parsedModuleName.packageName);
            }
            if (!depPkg) {
                var browserPackageName = this.globalBrowser[parsedModuleName.packageName];
                if (browserPackageName) {
                    parsedModuleName.packageName = browserPackageName;
                    depPkg = utils.pkg.findByName(this, parsedModuleName.packageName);
                }
            }
            if (!depPkg && refPkg === this.npmPaths.__default && name === refPkg.main && utils.pkg.hasDirectoriesLib(refPkg)) {
                parsedModuleName.version = refPkg.version;
                parsedModuleName.packageName = refPkg.name;
                parsedModuleName.modulePath = utils.pkg.main(refPkg);
                return oldNormalize.call(this, utils.moduleName.create(parsedModuleName), parentName, parentAddress, pluginNormalize);
            }
            if (depPkg) {
                parsedModuleName.version = depPkg.version;
                if (!parsedModuleName.modulePath) {
                    parsedModuleName.modulePath = utils.pkg.main(depPkg);
                }
                var moduleName = utils.moduleName.create(parsedModuleName);
                if (refPkg.system && refPkg.system.map && typeof refPkg.system.map[moduleName] === 'string') {
                    moduleName = refPkg.system.map[moduleName];
                }
                return oldNormalize.call(this, moduleName, parentName, parentAddress, pluginNormalize);
            } else {
                if (depPkg === this.npmPaths.__default) {
                    var localName = parsedModuleName.modulePath ? parsedModuleName.modulePath + (parsedModuleName.plugin ? parsedModuleName.plugin : '') : utils.pkg.main(depPkg);
                    return oldNormalize.call(this, localName, parentName, parentAddress, pluginNormalize);
                }
                if (refPkg.browser && refPkg.browser[name]) {
                    return oldNormalize.call(this, refPkg.browser[name], parentName, parentAddress, pluginNormalize);
                }
                return oldNormalize.call(this, name, parentName, parentAddress, pluginNormalize);
            }
        };
        var oldLocate = System.locate;
        System.locate = function (load) {
            var parsedModuleName = utils.moduleName.parse(load.name), loader = this;
            if (parsedModuleName.version && this.npm && !loader.paths[load.name]) {
                var pkg = this.npm[parsedModuleName.packageName];
                if (pkg) {
                    return oldLocate.call(this, load).then(function (address) {
                        var root = utils.pkg.rootDir(pkg, pkg === loader.npmPaths.__default);
                        if (parsedModuleName.modulePath) {
                            return utils.path.joinURIs(utils.path.addEndingSlash(root), parsedModuleName.plugin ? parsedModuleName.modulePath : utils.path.addJS(parsedModuleName.modulePath));
                        }
                        return address;
                    });
                }
            }
            return oldLocate.call(this, load);
        };
        var convertName = function (loader, name) {
            var pkg = utils.pkg.findByName(loader, name.split('/')[0]);
            if (pkg) {
                var parsed = utils.moduleName.parse(name, pkg.name);
                parsed.version = pkg.version;
                if (!parsed.modulePath) {
                    parsed.modulePath = utils.pkg.main(pkg);
                }
                return utils.moduleName.create(parsed);
            }
            return name;
        };
        var configSpecial = {
                map: function (map) {
                    var newMap = {}, val;
                    for (var name in map) {
                        val = map[name];
                        newMap[convertName(this, name)] = typeof val === 'object' ? configSpecial.map(val) : convertName(this, val);
                    }
                    return newMap;
                },
                meta: function (map) {
                    var newMap = {};
                    for (var name in map) {
                        newMap[convertName(this, name)] = map[name];
                    }
                    return newMap;
                },
                paths: function (paths) {
                    var newPaths = {};
                    for (var name in paths) {
                        newPaths[convertName(this, name)] = paths[name];
                    }
                    return newPaths;
                }
            };
        var oldConfig = System.config;
        System.config = function (cfg) {
            var loader = this;
            for (var name in cfg) {
                if (configSpecial[name]) {
                    cfg[name] = configSpecial[name].call(loader, cfg[name]);
                }
            }
            oldConfig.apply(loader, arguments);
        };
    };
});
/*semver*/
define('semver', [], function(){ return {}; });
/*npm-crawl*/
define('npm-crawl', [], function(){ return {}; });
/*npm*/
define('npm', [], function(){ return {}; });
/*package.json!npm*/
define('package.json!npm', [
    '@loader',
    'npm-extension',
    'module'
], function (loader, npmExtension, module) {
    npmExtension.addExtension(loader);
    if (!loader.main) {
        loader.main = 'css';
    }
    loader._npmExtensions = [].slice.call(arguments, 2);
    (function (loader, packages) {
        var g = loader.global;
        if (!g.process) {
            g.process = {
                cwd: function () {
                },
                env: { NODE_ENV: loader.env }
            };
        }
        if (!loader.npm) {
            loader.npm = {};
            loader.npmPaths = {};
            loader.globalBrowser = {};
        }
        loader.npmPaths.__default = packages[0];
        var lib = packages[0].system && packages[0].system.directories && packages[0].system.directories.lib;
        var setGlobalBrowser = function (globals, pkg) {
            for (var name in globals) {
                loader.globalBrowser[name] = {
                    pkg: pkg,
                    moduleName: globals[name]
                };
            }
        };
        var setInNpm = function (name, pkg) {
            if (!loader.npm[name]) {
                loader.npm[name] = pkg;
            }
            loader.npm[name + '@' + pkg.version] = pkg;
        };
        var forEach = function (arr, fn) {
            var i = 0, len = arr.length;
            for (; i < len; i++) {
                fn.call(arr, arr[i]);
            }
        };
        var setupLiveReload = function () {
            var hasLiveReload = !!(loader.liveReloadInstalled || loader._liveMap);
            if (hasLiveReload) {
                loader['import']('live-reload', { name: module.id }).then(function (reload) {
                    reload.dispose(function () {
                        delete loader.npm;
                        delete loader.npmPaths;
                    });
                });
            }
        };
        forEach(packages, function (pkg) {
            if (pkg.system) {
                var main = pkg.system.main;
                delete pkg.system.main;
                delete pkg.system.configDependencies;
                loader.config(pkg.system);
                pkg.system.main = main;
            }
            if (pkg.globalBrowser) {
                setGlobalBrowser(pkg.globalBrowser, pkg);
            }
            var systemName = pkg.system && pkg.system.name;
            if (systemName) {
                setInNpm(systemName, pkg);
            } else {
                setInNpm(pkg.name, pkg);
            }
            if (!loader.npm[pkg.name]) {
                loader.npm[pkg.name] = pkg;
            }
            loader.npm[pkg.name + '@' + pkg.version] = pkg;
            var pkgAddress = pkg.fileUrl.replace(/\/package\.json.*/, '');
            loader.npmPaths[pkgAddress] = pkg;
        });
        forEach(loader._npmExtensions || [], function (ext) {
            if (ext.systemConfig) {
                loader.config(ext.systemConfig);
            }
        });
        setupLiveReload();
    }(loader, [
        {
            'name': 'funcunit',
            'version': '3.0.0',
            'fileUrl': 'file:/Users/matthew/Projects/done-css/node_modules/funcunit/package.json',
            'main': 'dist/cjs/funcunit.js',
            'system': { 'main': 'funcunit' },
            'globalBrowser': {},
            'browser': {}
        },
        {
            'name': 'steal-qunit',
            'version': '0.0.4',
            'fileUrl': 'file:/Users/matthew/Projects/done-css/node_modules/steal-qunit/package.json',
            'main': 'steal-qunit',
            'system': {
                'npmIgnore': {
                    'bower': true,
                    'grunt': true,
                    'grunt-cli': true,
                    'grunt-contrib-copy': true,
                    'grunt-contrib-watch': true,
                    'steal': true,
                    'steal-tools': true
                },
                'meta': {
                    'qunitjs@1.18.0#qunit/qunit': {
                        'format': 'global',
                        'exports': 'QUnit',
                        'deps': ['steal-qunit/add-dom']
                    }
                }
            },
            'globalBrowser': {},
            'browser': {}
        },
        {
            'name': 'live-reload-testing',
            'version': '1.0.0',
            'fileUrl': 'file:/Users/matthew/Projects/done-css/node_modules/live-reload-testing/package.json',
            'main': 'main.js',
            'system': {
                'main': 'client',
                'npmDependencies': {}
            },
            'globalBrowser': {},
            'browser': {}
        },
        {
            'name': 'jquery',
            'version': '1.11.0',
            'fileUrl': 'file:/Users/matthew/Projects/done-css/node_modules/funcunit/node_modules/jquery/package.json',
            'main': 'dist/jquery.js',
            'globalBrowser': {},
            'browser': {}
        },
        {
            'name': 'syn',
            'version': '0.1.2',
            'fileUrl': 'file:/Users/matthew/Projects/done-css/node_modules/funcunit/node_modules/syn/package.json',
            'main': 'dist/cjs/syn.js',
            'system': {
                'directories': { 'lib': 'src' },
                'main': 'syn',
                'map': {},
                'ignoreBrowser': true
            },
            'globalBrowser': {},
            'browser': {}
        },
        {
            'name': 'qunitjs',
            'version': '1.18.0',
            'fileUrl': 'file:/Users/matthew/Projects/done-css/node_modules/steal-qunit/node_modules/qunitjs/package.json',
            'main': 'qunit/qunit.js',
            'globalBrowser': {},
            'browser': {}
        }
    ]));
});
/*test/basics/basics*/
define('test/basics/basics', function (require, exports, module) {
    require('./style.css!');
});
