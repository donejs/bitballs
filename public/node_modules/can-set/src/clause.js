var h = require("./helpers");

var clause = {};


/**
 * Exports a clause constructor functions like:
 *
 * new clause.Where()
 *
 * This is so we can tell what type of clause some properties are for.
 */
module.exports = clause;

clause.TYPES = [
	'where',
	'order',
	'paginate',
	'id'
];

// define clause type classes
h.each(clause.TYPES, function(type) {
	var className = type.charAt(0).toUpperCase()+type.substr(1);

	clause[className] = function(compare) {
		h.extend(this, compare);
	};

	clause[className].type = type;
});
