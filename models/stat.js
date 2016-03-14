var bookshelf = require("../models/bookshelf");
var Stat = bookshelf.Model.extend({
	tableName: 'stats'
});
module.exports = Stat;
