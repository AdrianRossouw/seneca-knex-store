var queries = require('./queries');
var store = require('../../knex-store.js');

module.exports = function(opts) {
	var seneca = this;

	seneca.use(store('-/-/seneca_knex_test', queries));
};