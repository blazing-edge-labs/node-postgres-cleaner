'use strict';

var async = require('async');
var helpers = require('./helpers');

function clean(db, callback) {

  var getAllTables = 'SELECT TABLE_NAME ' +
                     'FROM information_schema.tables ' +
                     'WHERE table_schema = \'public\';';

  db.query(getAllTables, function(err, tables) {
    if (err) return callback(err);

    var truncateTable = helpers.truncateTable.bind(null, db);

    async.each(tables.rows, truncateTable, function(err) {
      if (err) return callback(err);

      callback();
    });
  });
}

module.exports = clean;
