/*src/set*/
var set = require('./set-core.js');
var comparators = require('./comparators.js');
set.comparators = comparators;
set.helpers = require('./helpers.js');
var get = require('./get.js');
set.helpers.extend(set, get);
if (typeof window !== 'undefined' && !require.resolve) {
    window.set = set;
}
module.exports = set;