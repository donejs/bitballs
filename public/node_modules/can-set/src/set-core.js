var h = require("./helpers");
var clause = require("./clause");
var compare = require("./compare");


function Translate(clause, options){
	if(typeof options === "string") {
		var path = options;
		options = {
			fromSet: function(set, setRemainder){
				return set[path] || {};
			},
			toSet: function(set, wheres){
				set[path] = wheres;
				return set;
			}
		};
	}
	this.clause = clause;
	h.extend(this, options);
}
/**
 * An `Algebra` internally keeps different properties organized by clause type.
 * If an object comes in that isn't a clause type, it's assuemd to be a where.
 *
 * new set.Algebra(Where(),Paginate(),Sort())
 *
 */
var Algebra = function(){
	var clauses = this.clauses = {
		where: {},
		order: {},
		paginate: {},
		id: {}
	};
	this.translators = {
		where: new Translate("where", {
			fromSet: function(set, setRemainder){
				return setRemainder;
			},
			toSet: function(set, wheres){
				return h.extend(set, wheres);
			}
		})
	};
	var self = this;
	h.each(arguments, function(arg) {

		if(arg) {
			if(arg instanceof Translate) {
				self.translators[arg.clause] = arg;
			} else {
				h.extend(clauses[arg.constructor.type || 'where'], arg);
			}
		}
	});
};




Algebra.make = function(compare, count){
	if(compare instanceof Algebra) {
		return compare;
	} else {
		return new Algebra(compare, count);
	}
};

h.extend(Algebra.prototype, {

	// Breakup `set`'s properties by clauses in the algebra.
	// options:
	//  - omitCluases - clauses that should not be pulled out
	//
	// returns:
	//   - enabled - an object of which clauses are actually being used by this set. Where is true no matter what.
	//   - [clauseType] -  each clause type has the sets for that object
	getClauseProperties: function(set, options) {

		// Go through non-where clauses in algebra, remove those properties from a set clone.

		options = options || {};

		var setClone = h.extend({}, set);

		var clauses = this.clauses;
		var checkClauses = ['order', 'paginate','id'];

		var clauseProps = {
			enabled: {
				where: true,
				order: false,
				paginate: false,
				id: false
			}
		};

		if(options.omitClauses) {
			checkClauses = h.arrayUnionIntersectionDifference(checkClauses, options.omitClauses).difference;
		}

		h.each(checkClauses, function(clauseName) {
			var valuesForClause = {};
			var prop;

			// Go through the defined properties in this clauses
			for(prop in clauses[clauseName]) {
				// if it exists in the set, add it as a value for that clause
				if(prop in setClone) {
					valuesForClause[prop] = setClone[prop];
					delete setClone[prop];
				}
			}

			clauseProps[clauseName] = valuesForClause;

			// if there are properties set for this clause
			clauseProps.enabled[clauseName] = !h.isEmptyObject(valuesForClause);
		});

		// everything left is where
		clauseProps.where = options.isProperties? setClone : this.translators.where.fromSet(set, setClone);

		return clauseProps;
	},
	// Given the broken out clause properties of `getClauseProperties`
	// returns the names of the clauses that aren't exactly equal.
	getDifferentClauseTypes: function(aClauses, bClauses) {
		var self = this;
		var differentTypes = [];

		h.each(clause.TYPES, function(type) {
			if( !self.evaluateOperator(compare.equal, aClauses[type], bClauses[type], {isProperties: true},{isProperties:true}) ) {
				differentTypes.push(type);
			}
		});

		return differentTypes;
	},
	updateSet: function(set, clause, result, useSet) {
		if(result && typeof result === "object" && useSet !== false) {
			if( this.translators[clause] ) {
				set = this.translators.where.toSet(set, result);
			} else {
				set = h.extend(set, result);
			}
			return true;
		}
		else if(result) {
			return useSet === undefined ? undefined : false;
		}
		else {
			return false;
		}
	},
	// calls the operator method on different parts of the set.
	evaluateOperator: function(operator, a, b, aOptions, bOptions) {
		aOptions = aOptions || {};
		bOptions = bOptions || {};

		var aClauseProps = this.getClauseProperties(a, aOptions),
			bClauseProps = this.getClauseProperties(b, bOptions),
			set = {},
			useSet;

		var result = operator(aClauseProps.where, bClauseProps.where,
			undefined, undefined, undefined, this.clauses.where, {});

		useSet = this.updateSet(set, "where", result, useSet);

		// if success, and either has paginate props
		if(result && (aClauseProps.enabled.paginate || bClauseProps.enabled.paginate)) {

			// if they have an order, it has to be true for paginate to be valid
			if(aClauseProps.enabled.order || bClauseProps.enabled.order) {
				result = operator(aClauseProps.order, bClauseProps.order, undefined,
					undefined, undefined, {}, {});

				useSet = this.updateSet(set, "order", result, useSet);
			}

			if(result) {
				result = operator(aClauseProps.paginate, bClauseProps.paginate,
					undefined, undefined, undefined, this.clauses.paginate, {});

				useSet = this.updateSet(set, "paginate", result, useSet);
			}
		}
		// not checking order here makes it mean that different orders represent the same set?

		return result && useSet ? set : result;
	},
	equal: function(a, b) {
		return this.evaluateOperator(compare.equal, a, b);
	},
	subset: function(a, b) {
		var aClauseProps = this.getClauseProperties(a);
		var bClauseProps = this.getClauseProperties(b);
		var compatibleSort = true;
		var result;

		// if there is a paginate and an order, order has to be the same first.
		if((aClauseProps.enabled.paginate || bClauseProps.enabled.paginate) &&
			(aClauseProps.enabled.order || bClauseProps.enabled.order)) {
			// compare order clauses without any special comparators
			compatibleSort = compare.equal(aClauseProps.order, bClauseProps.order,
				undefined, undefined, undefined, {}, {});
		}

		if(!compatibleSort) {
			result = false;
		}
		else {
			result = this.evaluateOperator(compare.subset, a, b);
		}

		return result;
	},
	properSubset: function(a, b){
		return this.subset(a, b) && !this.equal(a, b);
	},
	// what a has that b doesn't
	/**
	 * // A has all of B
	 * set.difference( {} , {completed: true}, set.boolean("completed") ) //-> {completed: false}
	 *
	 * // A has all of B, but we can't figure out how to create a set object
	 * set.difference( {} , {completed: true} ) //-> undefined
	 *
	 * // Same sets
	 * set.difference( {} , {} ) //-> false
	 *
	 * // A is totally inside B
	 * set.difference( {completed: true}, {} ) //-> undefined
	 * @param {Object} a
	 * @param {Object} b
	 */
	difference: function(a, b) {
		var aClauseProps = this.getClauseProperties(a);
		var bClauseProps = this.getClauseProperties(b);

		var differentClauses = this.getDifferentClauseTypes(aClauseProps, bClauseProps);

		var result; // if too many clauses are different, then we won't be able
					// to determine the difference

		switch(differentClauses.length) {
			case 0 : {
				// if all the clauses are the same, then there can't be a difference
				result = false;
				break;
			}
			case 1 : {
				var clause = differentClauses[0];
				// if there's only one clause to evaluate, then we can try to determine
				// the difference set
				result = compare.difference(aClauseProps[clause],
					bClauseProps[clause], undefined, undefined, undefined,
					this.clauses[clause], {});

				if(this.translators[clause] && typeof result === "object") {
					result = this.translators[clause].toSet({}, result);
				}
				break;
			}
		}

		return result;
	},
	union: function(a, b){
		// if everything is equal or has a difference
		return this.evaluateOperator(compare.union, a, b);
	},
	intersection: function(a, b){
		// if everything is equal or has a difference
		return this.evaluateOperator(compare.intersection, a, b);
	},
	count: function(a){
		return this.evaluateOperator(compare.count, a, {});
	},
	has: function(set, props){
		// there is a `this.where`, `this.paginate`, etc clause on this object
		// if where is shifted ... we need to restore it later.

		// the rest is subset code
		var aClauseProps = this.getClauseProperties(set);
		var propsClauseProps = this.getClauseProperties(props,{isProperties: true});
		var compatibleSort = true;
		var result;

		// if there is a paginate and an order, order has to be the same first.
		if((propsClauseProps.enabled.paginate || aClauseProps.enabled.paginate) &&
			(propsClauseProps.enabled.order || aClauseProps.enabled.order)) {
			// compare order clauses without any special comparators
			compatibleSort = compare.equal(propsClauseProps.order, aClauseProps.order,
				undefined, undefined, undefined, {}, {});
		}

		if(!compatibleSort) {
			result = false;
		}
		else {
			result = this.evaluateOperator(compare.subset, props, set, {isProperties: true}, undefined);
		}

		return result;
	},
	index: function(set, items, item){
		var aClauseProps = this.getClauseProperties(set);
		var propName = h.firstProp(aClauseProps.order),
			compare,
			orderValue;
		if(propName) {
			compare = this.clauses.order[propName];
			orderValue = set[propName];

			return h.index(function(itemA, itemB){
				return compare(orderValue, itemA, itemB);
			},items, item);
		}
		propName = h.firstProp(this.clauses.id);
		if(propName) {
			compare = h.defaultSort;
			orderValue = propName;
			return h.index(function(itemA, itemB){
				return compare(orderValue, itemA, itemB);
			},items, item);
		}
		// undefined so the behavior can be figured out by the behavior
		return;
	}
	// getSubset(a, b, bData,)
	// getUnion(a,b,aItems, bItems, bData)
	//
});

module.exports = {
	Algebra : Algebra,
	Translate: Translate,
	difference: function(a, b, config) {
		return Algebra.make(config).difference(a, b);
	},
	equal: function(a, b, config) {
		return Algebra.make(config).equal(a, b);
	},
	subset: function(a, b, config) {
		return Algebra.make(config).subset(a, b);
	},
	properSubset: function(a, b, config) {
		return Algebra.make(config).properSubset(a, b);
	},
	union: function(a, b, config) {
		return Algebra.make(config).union(a, b);
	},
	intersection: function(a, b, config){
		return Algebra.make(config).intersection(a, b);
	},
	count: function(a, config){
		return Algebra.make(config).count(a);
	},
	has: function(set, props, config){
		return Algebra.make(config).has(set, props);
	},
	index: function(set, items, item, config) {
		return Algebra.make(config).index(set, items, item);
	}
};
