/* jshint mocha: true */
var conn = require('./connection');

var assert = require('assert');

var queries = require('./queries');

var fixture = {
  id: '12345',
	title: 'Entity Test',
	content: 'Entity Test',
  createdDate: '2015-08-24T17:58:03.538Z',
  createdBy: 'adrian'
};

describe('example queries', function() {
  before(function(done) {
    install().then(done.bind(null, null));
  });


	it('insert', function(done) {
		queries.insert(fixture, done)
			.then(done.bind(null, null))
			.catch(done);
	});

	it('read', function(done) {
		queries.read({ id: fixture.id })
			.then(function(rows) {
				var row = rows[0];
				assert.equal(row.id, fixture.id);
				assert.equal(row.createdBy, fixture.createdBy);
				done();
			})
			.catch(done);
	});

	it('update', function(done) {
		queries.update(fixture)
			.then(function(rows) { done(); })
			.catch(done);
		});
		
	it('remove', function(done) {
		queries.remove({ id: fixture.id })
			.then(function() { done(); })
			.catch(done);
	});
});

function install(opts) {
  return query().raw(''+ fs.readFileSync(__dirname + '/schema.sql'));
};

function uninstall(opts) {
  return query().raw('drop table blog_post');
};
