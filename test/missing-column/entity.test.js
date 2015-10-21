var _ = require('lodash');
var assert = require('assert');
var queries = require('./queries');
var seneca = require('seneca')();
var uuid = require('node-uuid');

var _entity = 'seneca_knex_test';
var entityId = uuid.v4();
var fixtureDate = new Date();

fixtureDate = fixtureDate.toISOString();

seneca.use(require('./'));

var fixture = {
	id: entityId,
	title: 'entity.test.js',
	content: 'this is a test',
	created_by: 'entity.test.js',
	created_date: fixtureDate
};

var knex = require('knex')({
	client: 'pg',
	connection: {
		host     : '127.0.0.1',
		user     : 'postgres',
		database : 'postgres'
	}
});



describe('seneca-knex-store entity test', function() {
	before( function() {
		knex.schema.hasTable('seneca_knex_test').then(function(exists) {
			if (!exists) {
				return knex.schema.createTable('seneca_knex_test', function(t) {
					t.string('id');
					t.string('title');
					t.string('content');
					t.date('created_by');
					t.date('created_date');
				});
			}
		});
	})

	after( function() {
		knex.schema.dropTable('seneca_knex_test')
	})

	it('missing column', function(done) {

		var ent = seneca.make$(_entity);

		fixture['COLUMN_NOT_IN_TABLE'] = 'FAIL_ME'

		ent = _.extend(ent, fixture);

		ent.load$(function(err, res) {
			assert.equal('seneca: load', err.message)
			done();
		});

	});

})