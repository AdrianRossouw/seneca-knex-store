/* jshint mocha: true */

var assert = require('assert');
var queries = require('./queries');
var fixture = require('./test.fixture.js');


var seneca = require('seneca')({
  strict: { fatal$: false }
});

seneca.use(require('./entity'));

describe('blog seneca calls', function() {
	var id = null;
	var loadedEnt = null;

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
		var ent = seneca.make$('-/-/blog');

		ent.title = fixture.title;
    ent.content = fixture.content;
		ent.createdBy = fixture.createdBy;
		ent.createdDate = fixture.createdDate;

		ent.save$(function(err, res) {
			id = res.data$().id;
			done();
		});
	});

	it('load', function(done) {
		var ent = seneca.make$('-/-/blog');
    ent.load$({ id: id }, function(err, row) {
			loadedEnt = row;
			assert.equal(row.id, id);
			assert.equal(row.createdDate, fixture.createdDate);
			done();
		});
	});

	it('update', function(done) {
		loadedEnt.content = 'test changed';

    loadedEnt.save$(function(err, ent) {
      queries.load({ id: ent.id })
        .then(function(rows) {
          assert.equal(rows[0].content, loadedEnt.content);

          done();
        });
		});
	});

	it('remove', function(done) {
		queries.remove({ id: fixture.id })
      .then(function(res) { return queries.load({ id: fixture.id }); })
      .then(function(res) {
        assert.equal(res.length, 0);

        done();
      })
      .catch(done);
	});
});
