var test = require('tape');
var plugin = require('..');
var seneca = require('seneca')({strict: { add: false }});

var knex = require('knex');



//seneca.use(plugin);

test('start up', function(t) {
  t.test('on ready', function(t) {
    seneca.ready(function() {
      t.end();
    });
  });
});

test('basic query2', function(t) {
  t.plan(1);
  seneca.add('role:knex,cmd:query,name:blog', function(args, done) {
    t.ok(args.knex$);
    args.knex$
      .select('id', 'created', 'title', 'body')
      .from('sys_blog');

    this.prior(args, done);
  });
seneca.wrap({role:'knex'}, function(args, done) {
    args.knex$ = knex;
    console.trace();
    this.prior(args, done);
  });
  /*seneca.act('role:knex,cmd:query,name:blog', function(err, query) {
    t.false(err);

    var expected = 'select "id", "created", "title", "body" from "sys_blog"';
    t.equal(query, expected, "query does not match");

    t.end();
  });
  */
  test.skip('additional where', function(t) {
    seneca.add('role:knex,cmd:register,name:blog,filter:byUser', function(args, done) {
      if (!args.uid) { return done('no user id'); }
      var expected = 'select "id", "created", "title", "body" from "sys_blog" where "uid"=1';

      args.knex$.where('uid', args.uid);

      this.prior(args, done);
    });

    // fetch the blog posts for a specific user.
    seneca.act('role:knex,cmd:query,name:blog,filter:byUser', { uid: 1 }, function(args, done) {
      console.log(args.rows);

      t.end();
      done();
    });
  });
});
