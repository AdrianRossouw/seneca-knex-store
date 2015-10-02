var query = require('./connection');
var _ = require('lodash');
var fs = require('fs');

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
  return [
    'id', 'title', 'content',
    'created_by as createdBy',
    'created_date as createdDate'
  ];
}

function list(opts) {
  var knex = query().table('blog_post');
  
  knex.select(_getColumns(opts));

  return knex;
}

function load(opts) {
  var knex = list(opts);

  knex.where('id', opts.id);

  return knex;
}

function insert(opts) {
  var knex = query().table('blog_post');

  knex.insert(_setColumns(opts));

  return knex;
}

function update(opts) {
  var knex = query().table('blog_post');
  var columns = _.omit(_setColumns(opts), 'id');

  knex.where('id', opts.id);
  knex.update(columns);

  return knex;
}

function remove(opts) {
  var knex = query().table('blog_post');

  knex.where('id', opts.id);
  knex.del();

  return knex;
}

function install(opts) {
  console.log(__dirname + '/schema.sql')

  return query().raw(''+ fs.readFileSync(__dirname + '/schema.sql'));
};

function uninstall(opts) {
  return query().raw('drop table blog_post');
};

module.exports = {
  insert: insert,
  update: update,
  load: load,
  list: list,
  remove: remove,
  install: install,
  uninstall: uninstall
};
