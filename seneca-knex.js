var knex = require('knex');
module.exports = function SenecaKnex(options) {
  var seneca = this;

  seneca.wrap({role:'knex'}, function(args, done) {
    args.knex$ = knex;
    console.trace();
    this.prior(args, done);
  });
};
