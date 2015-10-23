var _ = require('lodash');
var assert = require('assert');
var fs = require('fs');

var query = require('./connection');
var _entity = 'seneca_knex_test';

var _columns = [
	'id',
	'title',
	'content',
	'created_by',
	'created_date',
	'COLUMN_NOT_IN_TABLE'
];

function _setColumns(opts) {
	return {
		id: opts.id,
		content: opts.content,
		title: opts.title,
		created_by: opts.createdBy,
		created_date: opts.createdDate
	};
}

function _getColumns(opts) {
	var result = [];

	// this will fail when an unknown column comes through
	_.each(_.keys(opts.ent), function (column) {
		if (_columns.indexOf(column) >= 0) {
			result.push(column);
		}
	});

	return result;
}

function _setWhere(knex, opts) {

	opts.id && knex.where('id', opts.id);

	return knex;
}

function list(opts) {
	var knex = query().table(_entity);
	
	knex.select(_getColumns(opts));

	return knex;
}

function load(opts) {
	assert(opts.q); // fail immediately if we're missing the q from seneca
	var knex = query().table(_entity);

	knex = _setWhere(knex, opts.q);
	knex.select(_getColumns(opts));

	return knex;
}

function insert(opts) {
	var entity = opts.ent ? opts.ent : opts;
	var knex = query().table(_entity);

	knex.insert(_setColumns(entity));

	return knex;
}

function update(opts) {
	assert(opts.ent.id); // fail immediately if entity.id is missing or empty

	var knex = query().table(_entity);
	var columns = _.omit(_setColumns(opts.ent), 'id');

	knex.where('id', opts.ent.id);
	knex.update(columns);

	return knex;
}

function remove(opts) {
	assert(opts.q); // fail immediately if we're missing the q from seneca

	var knex = query().table(_entity);

	knex = _setWhere(knex, opts.q);
	knex.del();

	return knex;
}


function uninstall(opts) {

	// return query().raw('drop table ' + _entity);
};

module.exports = {
	insert: insert,
	update: update,
	load: load,
	list: list,
	remove: remove
};
