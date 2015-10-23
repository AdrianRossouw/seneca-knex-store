var knex = require('knex')({
	client: 'pg',
	connection: {
		host     : '127.0.0.1',
		user     : 'postgres',
		database : 'postgres'
	}
});

module.exports = function() {
  return knex;
}
