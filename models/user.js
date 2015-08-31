var bookshelf = require("../bookshelf");

var User = bookshelf.Model.extend({
	tableName: 'users'
});

module.exports = User;