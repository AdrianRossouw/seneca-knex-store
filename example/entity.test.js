/* jshint mocha: true */

var assert = require('assert');

var query = require('./query');
var seneca = require('seneca')({
  strict: { fatal$: false }
});

seneca.use(require('./entity'));

var fixture = {
  id: '12345',
	title: 'Entity Test',
	content: 'Entity Test',
  createdDate: '2015-08-24T17:58:03.538Z',
  createdBy: 'adrian'
};

describe('example queries', function() {
	var id = null;
	var loadedEnt = null;

	it('insert', function(done) {
		var ent = seneca.make$('-/-/example');

		ent.id = fixture.id;
		ent.tite = fixture.tite;
    ent.content = fixture.content;
		ent.createdBy = fixture.lastUpdatedBy;
		ent.createdDate = fixture.lastUpdatedDate;

		ent.save$(function(err, res) {
			id = res.data$().id;
			done();
		});
	});

	it('load', function(done) {
		var ent = seneca.make$('-/-/example');
		ent.load$({ id: id }, function(err, row) {
			loadedEnt = row;
			assert.equal(row.id, id);
			assert.equal(row.lastUpdatedBy, fixture.lastUpdatedBy);
			done();
		});
	});

	it.skip('update', function(done) {
		loadedEnt.description = 'test changed';

		query.save$(function(err, res) {
			
		});
	});

	it.skip('remove', function(done) {
		query.remove({ id: fixture.id })
		.then(function() { done(); })
		.catch(done);
	});
});
