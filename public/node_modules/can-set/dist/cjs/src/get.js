/*src/get*/
var compare = require('./compare.js');
var set = require('./set-core.js');
var h = require('./helpers.js');
var filterData = function (data, clause, comparators) {
    return h.filter.call(data, function (item) {
        var isSubset = compare.subset(item, clause, undefined, undefined, undefined, comparators, {});
        return isSubset;
    });
};
var getAData = function (a, b, bData, algebra) {
    var aClauseProps = algebra.getClauseProperties(a);
    var bClauseProps = algebra.getClauseProperties(b);
    var options = {};
    var aData = filterData(bData, aClauseProps.where, algebra.clauses.where);
    if (aData.length && (aClauseProps.enabled.paginate || bClauseProps.enabled.paginate)) {
        if (aClauseProps.enabled.order || bClauseProps.enabled.order) {
            options = {};
            var propName = h.firstProp(aClauseProps.order), compareOrder = algebra.clauses.order[propName];
            aData = aData.sort(function (aItem, bItem) {
                return compareOrder(a[propName], aItem, bItem);
            });
        }
        options = {};
        compare.subset(aClauseProps.paginate, bClauseProps.paginate, undefined, undefined, undefined, algebra.clauses.paginate, options);
        h.each(options.getSubsets, function (filter) {
            aData = filter(a, b, aData, algebra, options);
        });
    }
    return aData;
};
module.exports = {
    getSubset: function (a, b, bData, algebra) {
        algebra = set.Algebra.make(algebra);
        var aClauseProps = algebra.getClauseProperties(a);
        var bClauseProps = algebra.getClauseProperties(b);
        var isSubset = set.subset(h.extend({}, aClauseProps.where, aClauseProps.paginate), h.extend({}, bClauseProps.where, bClauseProps.paginate), algebra);
        if (isSubset) {
            return getAData(a, b, bData, algebra);
        }
    },
    getUnion: function (a, b, aItems, bItems, algebra) {
        var options = {};
        if (compare.subset(a, b, undefined, undefined, undefined, algebra, options)) {
            return bItems;
        } else if (compare.subset(b, a, undefined, undefined, undefined, algebra, options)) {
            return aItems;
        }
        var isUnion = compare.union(a, b, undefined, undefined, undefined, algebra, options);
        if (isUnion) {
            h.each(options.getUnions, function (filter) {
                var items = filter(a, b, aItems, bItems, algebra, options);
                aItems = items[0];
                bItems = items[1];
            });
            return aItems.concat(bItems);
        }
    }
};