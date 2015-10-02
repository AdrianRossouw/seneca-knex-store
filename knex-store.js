/* jshint ignore:start */
var senecaStore = require('seneca/lib/store');
var uuid = require('node-uuid');

module.exports = function CreateStore(entity, queries) {
	return function(opts) {
		var seneca = this;

		var storeOpts = {map:{}};
		storeOpts.map[entity] = '*';
		seneca.log.info('register store', entity);

		var storeCmds = {

			name: entity,

			save: function (args, cb) {
				var ent = args.ent;
				var update = !!ent.id;
				var query;

				if (update) {
					query = queries.update(args);

					process.env.LOG_QUERY && console.log('entity.update', query.toString());

					query.then(function(res) {
							cb(null, ent);
						}, function(err) {
							seneca.fail({ code: 'update', tag: args.tag$, store: entity,  error: err }, cb);
						});

				} else {
					args.ent.id = args.ent.id$ || uuid();

					var query = queries.insert(args);

					process.env.LOG_QUERY && console.log('entity.insert', query.toString());

					query.then(function(res) {
						cb(null, args.ent);
					}, function(err) {
						seneca.fail({code: 'save', tag: args.tag$, store: entity, error: err}, cb);
					});
				}
			},

			load: function (args, cb) {
				var ent = args.ent;

				var query = queries.load(args);

				process.env.LOG_QUERY && console.log('entity.load', query.toString());

				query.then(function(rows) {
					seneca.log(args.tag$, 'load', ent);

					if (rows && rows.length) {
						ent.data$(rows[0]);
						cb(null, ent);
					} else {
						cb(null, undefined);
					}
				}, function(err) {
					seneca.log.error(query.toString(), query.values, trace.stack);
					seneca.fail({code: 'load', tag: args.tag$, store: store.name, query: query, error: err}, cb);
				});
			},


			list: function (args, cb) {
				var qent = args.qent;

				var query = queries.list(args);

				process.env.LOG_QUERY && console.log('entity.list', query.toString());

				query.then(function(rows) {
						var list = rows.map(function(row) {	return qent.make$(row);	});
						seneca.log(args.tag$, 'list', list.length, list[0]);
						cb(null, list);
					}, function(err) {
						seneca.fail({code: 'list', tag: args.tag$, store: store.name, query: query, error: err}, cb);
					});

			},

			remove: function (args, cb) {
				var query = queries.remove(args)

				process.env.LOG_QUERY && console.log('entity.remove', query.toString());

				query.then(function(res) {
						var result = {rowCount: res};

						cb(null, result);
						seneca.log(args.tag$, 'remove', res.rowCount);
					}, function(err) {
						cb(err, undefined);
					});
			},

			close: function (cb) { /* noop */  },
			native: function (args, done) {	done(null);	}
		};
		senecaStore.init(seneca, storeOpts, storeCmds);
	};
};
