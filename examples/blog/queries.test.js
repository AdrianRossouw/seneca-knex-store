/* jshint mocha: true */

var assert = require('assert');
var queries = require('./queries');
var fixture = require('./test.fixture.js');

describe('example queries', function() {
	var opts = {
		q: fixture.id,
		ent: fixture
	}

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

		queries.insert(opts)
			.then(function(result) {
				assert.equal(1, result[0]);
				done();
			})
			.catch(function(error) {
				var msg = error.detail ? error.detail : error.message;
				done(new Error(msg));
			});
	});

	it('load', function(done) {
		queries.load(opts)
			.then(function(rows) {
				var row = rows[0];

				assert.equal(row.id, fixture.id);
				assert.equal(row.createdBy, fixture.createdBy);
				done();
			})
			.catch(done);
	});

	it('update', function(done) {
		opts.ent.title = 'Entity Test Edit';


		queries.update(opts)
			.then(function(rows) {
				return queries.load(opts);
			})
			.then(function(data) {
				assert.equal(data[0].title, fixture.title);
				assert.equal(data[0].content, fixture.content);

				done();
			})
			.catch(function(error) {
				var msg = error.detail ? error.detail : error.message;
				done(new Error(msg));
			});
	});
		
	it('remove', function(done) {
		queries.remove(opts)
		.then(function(result) {
			assert.equal(1, result);

			done();
		})
		.catch(function(error) {
			var msg = error.detail ? error.detail : error.message;
			done(new Error(msg));
		});
	});

	it('load after remove', function (done) {
		queries.load(opts)
			.then(function(rows) {

				assert.equal(0, rows.length);
				done();
			})
			.catch(done);
	});
});

