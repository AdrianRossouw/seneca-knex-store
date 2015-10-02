var knex = require('knex')({
	client: 'sqlite3',
	connection: {
    filename: './blog.sqlite3'
	}
});

module.exports = function() {
  return knex;
}
