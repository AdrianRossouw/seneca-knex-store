var query = require('./connection');
var _ = require('lodash');


function _setColumns(opts) {
  return {
    id: opts.id,
    content: opts.content,
    type: opts.type,
    created_by: opts.createdBy,
    created_date: opts.createdDate
  };
}

function _getColumns(opts) {
  return [
    'id', 'title', 'content',
    'created_by as createdBy',
    'created_date as createdDate'
  ];
}

function list(opts) {
  var knex = query('blog_post');

  knex.select(_getColumns(opts));

  return knex;
}

function read(opts) {
  var knex = list(opts);

  knex.where('id', opts.id);

  return knex;
}

function insert(opts) {
  var knex = query('blog_post');

  knex.insert(_setColumns(opts));

  return knex;
}

function update(opts) {
  var knex = query('blog_post');
  var columns = _.omit(_setColumns(opts), 'id');

  knex.where('id', opts.id);
  knex.update(columns);

  return knex;
}

function remove(opts) {
  var knex = query('blog_post');

  knex.where('id', opts.id);
  knex.del();

  return knex;
}

module.exports = {
  insert: insert,
  update: update,
  read: read,
  list: list,
  remove: remove
};
