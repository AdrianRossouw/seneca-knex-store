/* jshint mocha: true */

var assert = require('assert');
var queries = require('./queries');
var fixture = require('./test.fixture.js');

describe('example queries', function() {

  before(function(done) {
    queries.install()
      .then(done.bind(null, null))
      .catch(done);
  });

  after(function(done) {
    queries.uninstall()
      .then(done.bind(null, null))
      .catch(done);
  });

	it('insert', function(done) {
		queries.insert(fixture, done)
			.then(done.bind(null, null))
			.catch(done);
	});

	it('load', function(done) {
		queries.load({ id: fixture.id })
			.then(function(rows) {
				var row = rows[0];
				assert.equal(row.id, fixture.id);
				assert.equal(row.createdBy, fixture.createdBy);
				done();
			})
			.catch(done);
	});

  it('update', function(done) {
    fixture.title = 'Entity Test Edit';

    queries.update(fixture)
      .then(function(rows) {
        return queries.load({ id: fixture.id });
      })
    .then(function(data) {
        assert.equal(data[0].title, fixture.title);
        assert.equal(data[0].content, fixture.content);

        done();
      })
      .catch(done);
  });
		
	it('remove', function(done) {
		queries.remove({ id: fixture.id })
    .then(function() { return queries.load({ id: fixture.id }); })
    .then(function(data) {
      assert.equal(data.length, 0);

      done();
    })
    .catch(done);
	});

  it('load after remove', function (done) {
    queries.load({ id: fixture.id })
      .then(function(rows) {
        var row = rows[0];
        assert.equal(row, undefined);
        done();
      })
      .catch(done);
  });
});

