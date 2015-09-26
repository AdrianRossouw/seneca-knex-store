/* jshint mocha: true */

var assert = require('assert');

var query = require('./query');

var fixture = {
  id: '12345',
	title: 'Entity Test',
	content: 'Entity Test',
  createdDate: '2015-08-24T17:58:03.538Z',
  createdBy: 'adrian'
};

describe('example queries', function() {
  before(function(done) {
    query.install()
    .then(done.bind(null, null));

  });

  after(function(done) {

    query.uninstall()
      .then(done.bind(null, null));


  });

	it('insert', function(done) {
		query.insert(fixture, done)
			.then(done.bind(null, null))
			.catch(done);
	});

	it('read', function(done) {
		query.read({ id: fixture.id })
			.then(function(rows) {
				var row = rows[0];
				assert.equal(row.id, fixture.id);
				assert.equal(row.createdBy, fixture.createdBy);
				done();
			})
			.catch(done);
	});

	it('update', function(done) {
		query.update(fixture)
			.then(function(rows) { done(); })
			.catch(done);
		});
		
	it('remove', function(done) {
		query.remove({ id: fixture.id })
			.then(function() { done(); })
			.catch(done);
	});
});
