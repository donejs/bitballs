/*src/comparators*/
var h = require('./helpers.js');
var clause = require('./clause.js');
var within = function (value, range) {
    return value >= range[0] && value <= range[1];
};
var diff = function (setA, setB, property1, property2) {
    var sAv1 = setA[property1], sAv2 = setA[property2], sBv1 = setB[property1], sBv2 = setB[property2], count = sAv2 - sAv1 + 1;
    var after = {
            difference: [
                sBv2 + 1,
                sAv2
            ],
            intersection: [
                sAv1,
                sBv2
            ],
            union: [
                sBv1,
                sAv2
            ],
            count: count,
            meta: 'after'
        };
    var before = {
            difference: [
                sAv1,
                sBv1 - 1
            ],
            intersection: [
                sBv1,
                sAv2
            ],
            union: [
                sAv1,
                sBv2
            ],
            count: count,
            meta: 'before'
        };
    if (sAv1 === sBv1 && sAv2 === sBv2) {
        return {
            intersection: [
                sAv1,
                sAv2
            ],
            union: [
                sAv1,
                sAv2
            ],
            count: count,
            meta: 'equal'
        };
    } else if (sAv1 === sBv1 && sBv2 < sAv2) {
        return after;
    } else if (sAv2 === sBv2 && sBv1 > sAv1) {
        return before;
    } else if (within(sAv1, [
            sBv1,
            sBv2
        ]) && within(sAv2, [
            sBv1,
            sBv2
        ])) {
        return {
            intersection: [
                sAv1,
                sAv2
            ],
            union: [
                sBv1,
                sBv2
            ],
            count: count,
            meta: 'subset'
        };
    } else if (within(sBv1, [
            sAv1,
            sAv2
        ]) && within(sBv2, [
            sAv1,
            sAv2
        ])) {
        return {
            intersection: [
                sBv1,
                sBv2
            ],
            difference: [
                null,
                null
            ],
            union: [
                sAv1,
                sAv2
            ],
            count: count,
            meta: 'superset'
        };
    } else if (sAv1 < sBv1 && within(sAv2, [
            sBv1,
            sBv2
        ])) {
        return before;
    } else if (sBv1 < sAv1 && within(sBv2, [
            sAv1,
            sAv2
        ])) {
        return after;
    } else if (sAv2 === sBv1 - 1) {
        return {
            difference: [
                sAv1,
                sAv2
            ],
            union: [
                sAv1,
                sBv2
            ],
            count: count,
            meta: 'disjoint-before'
        };
    } else if (sBv2 === sAv1 - 1) {
        return {
            difference: [
                sAv1,
                sAv2
            ],
            union: [
                sBv1,
                sAv2
            ],
            count: count,
            meta: 'disjoint-after'
        };
    }
    if (!isNaN(count)) {
        return {
            count: count,
            meta: 'disjoint'
        };
    }
};
var cleanUp = function (value, enumData) {
    if (!value) {
        return enumData;
    }
    if (!h.isArrayLike(value)) {
        value = [value];
    }
    if (!value.length) {
        return enumData;
    }
    return value;
};
module.exports = {
    'enum': function (prop, enumData) {
        var compares = new clause.Where({});
        compares[prop] = function (vA, vB, A, B) {
            vA = cleanUp(vA, enumData);
            vB = cleanUp(vB, enumData);
            var data = h.arrayUnionIntersectionDifference(vA, vB);
            if (!data.difference.length) {
                delete data.difference;
            }
            h.each(data, function (value, prop) {
                if (h.isArrayLike(value)) {
                    if (h.arraySame(enumData, value)) {
                        data[prop] = undefined;
                    } else if (value.length === 1) {
                        data[prop] = value[0];
                    }
                }
            });
            return data;
        };
        return compares;
    },
    rangeInclusive: function (startIndexProperty, endIndexProperty) {
        var compares = {};
        var makeResult = function (result, index) {
            var res = {};
            if (result.intersection) {
                res.intersection = result.intersection[index];
            }
            if (result.difference) {
                res.difference = result.difference[index];
            }
            if (result.union) {
                res.union = result.union[index];
            }
            if (result.count) {
                res.count = result.count;
            }
            return res;
        };
        compares[startIndexProperty] = function (vA, vB, A, B) {
            if (vA === undefined) {
                return;
            }
            var res = diff(A, B, startIndexProperty, endIndexProperty);
            var result = makeResult(res, 0);
            result.getSubset = function (a, b, bItems, algebra, options) {
                return bItems;
            };
            result.getUnion = function (a, b, aItems, bItems, algebra, options) {
                return [
                    aItems,
                    bItems
                ];
            };
            return result;
        };
        compares[endIndexProperty] = function (vA, vB, A, B) {
            if (vA === undefined) {
                return;
            }
            var data = diff(A, B, startIndexProperty, endIndexProperty);
            var res = makeResult(data, 1);
            res.getSubset = function (a, b, bItems, algebra, options) {
                var aStartValue = a[startIndexProperty], aEndValue = a[endIndexProperty];
                var bStartValue = b[startIndexProperty];
                if (!(endIndexProperty in b) || !(endIndexProperty in a)) {
                    return bItems.slice(aStartValue, aEndValue + 1);
                }
                return bItems.slice(aStartValue - bStartValue, aEndValue - bStartValue + 1);
            };
            res.getUnion = function (a, b, aItems, bItems, algebra, options) {
                if (data.meta.indexOf('after') >= 0) {
                    if (data.intersection) {
                        bItems = bItems.slice(0, data.intersection[0] - b[startIndexProperty]);
                    }
                    return [
                        bItems,
                        aItems
                    ];
                }
                if (data.intersection) {
                    aItems = aItems.slice(0, data.intersection[0] - a[startIndexProperty]);
                }
                return [
                    aItems,
                    bItems
                ];
            };
            return res;
        };
        return new clause.Paginate(compares);
    },
    'boolean': function (propertyName) {
        var compares = new clause.Where({});
        compares[propertyName] = function (propA, propB) {
            var notA = !propA, notB = !propB;
            if (propA === notB && propB === notA) {
                return {
                    difference: !propB,
                    union: undefined
                };
            } else if (propA === undefined) {
                return {
                    difference: !propB,
                    intersection: propB,
                    union: undefined
                };
            }
        };
        return compares;
    },
    'sort': function (prop, sortFunc) {
        if (!sortFunc) {
            sortFunc = h.defaultSort;
        }
        var compares = {};
        compares[prop] = sortFunc;
        return new clause.Order(compares);
    },
    'id': function (prop) {
        var compares = {};
        compares[prop] = prop;
        return new clause.Id(compares);
    }
};