# seneca-knex

This library provides a structured way for you to build and execute sql queries
using knex.js, in a seneca.js based application.

You want to use this library if :

* You have relational data already.
* It is complex enough to need a custom schema.
* You have specific query requirements.
* You need to write queries in a way to be extended by other actions.
* It is not feasible to write raw sql for all queries.

You do not want to use this library if :

* You are looking for an ORM.
* You want sql queries to be generated for you.
* You need a seneca entity store you can just plug in.

## Example

```javascript

var seneca = require('seneca')();

seneca.use(require('seneca-knex'));

seneca.add('role:knex,cmd:register,name:blog', function(args, done) {
  args.knex$
    .select('id', 'created', 'title', 'body')
    .from('sys_blog');
    .orderBy('created', 'desc')
    .limit(10);

  this.prior(args, done);
});

seneca.add('role:knex,cmd:register,name:blog,filter:byUser', function(args, done) {
  if (!args.uid) { return done('no user id'); }

  args.knex$.where('uid', args.uid);

  this.prior(args, done);
});

// fetch the blog posts for a specific user.
seneca.act('cmd:query,name:blog,filter:byUser', { uid: 1 }, function(err, rows) {
  console.log(rows);

  done();
});
```
