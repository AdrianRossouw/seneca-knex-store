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

__See example folder for more__
