var query = require('./query');
var store = require('../knex-store');

module.exports = function(opts) {
	var seneca = this;

	seneca.use(store('blog', {
		insert: query.insert,
		update: query.update,
		remove: query.remove,
		list: query.list,
		load: query.load
	}));

};
