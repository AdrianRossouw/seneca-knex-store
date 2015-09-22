/* jshint mocha: true */

var assert = require('assert');

var query = require('./query');

var fixture = {
    id: '110eee38-c8b7-4caf-918d-c304bff74073',
    key: 'picklist::test',
    locale: 'en_US',
    value: 'picklist test',
    description: 'picklist test',
    createdDate: '2015-08-24T17:58:03.538Z',
    lastUpdatedBy: null,
    lastUpdatedDate: '2015-08-24T17:58:03.538Z'
};

describe('translation queries', function() {
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
				assert.equal(row.lastUpdatedBy, fixture.lastUpdatedBy);
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
