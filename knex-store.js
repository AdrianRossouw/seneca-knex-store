/* jshint ignore:start */
var senecaStore = require('seneca/lib/store');
var uuid = require('node-uuid');


module.exports = function CreateStore(entity, queries) {
  return function(opts) {
    var seneca = this;

    var storeOpts = {map:{}};
    storeOpts.map[entity] = '*';
    log.info('register store', entity);
    var storeCmds = {

      name: entity,

      save: function (args, cb) {
        var ent = args.ent;
        var update = !!ent.id;
        var query;

        if (update) {
          query = queries.update(ent)

          seneca.log.info(query.toString(), err);
          query.then(function(res) {
              seneca.log(args.tag$, 'update', query.toString());
              cb(null, ent);
            }, function(err) {
              seneca.fail({ code: 'update', tag: args.tag$, store: entity,  error: err }, cb);
            });

        } else {
          ent.id = ent.id$ || uuid()

          var query = queries.insert(ent);

          seneca.log.info(query.toString(), err);
          query.then(function(res) {
            cb(null, ent);
          }, function(err) {
            seneca.log.error(query.toString(), err);
            seneca.fail({code: 'save', tag: args.tag$, store: entity, error: err}, cb);
          });
        }
      },

      load: function (args, cb) {
        var query = queries.load(args)
        query.then(function(rows) {
          if (rows && rows.length) {
            ent.make$(rows[0]);
          }

          seneca.log(args.tag$, 'load', args.ent);

          cb(null, args.q);
        }, function(err) {
          seneca.log.error(query.toString(), query.values, trace.stack);
          seneca.fail({code: 'load', tag: args.tag$, store: store.name, query: query, error: err}, cb);
        });
      },


      list: function (args, cb) {
        var qent = args.qent;
        var q = args.q;

        queries.list(args.q)
          .then(function(rows) {
            var list = rows.map(function(row) {	return qent.make$(row);	});
            seneca.log(args.tag$, 'list', list.length, list[0]);
            cb(null, list);
          }, function(err) {
            seneca.fail({code: 'list', tag: args.tag$, store: store.name, query: query, error: err}, cb);
          });

      },

      remove: function (args, cb) {
        var qent = args.qent;
        var q = args.q;

        queries.remove(args)
          .then(function(res) {
            cb(null, res.rowCount);
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

