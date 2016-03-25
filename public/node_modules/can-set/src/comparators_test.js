var QUnit = require("steal-qunit");

QUnit.module("comparators");

require('./comparator_tests/sort_test');
require('./comparator_tests/rangeInclusive_test');
require('./comparator_tests/boolean_test');
require('./comparator_tests/enum_test');
