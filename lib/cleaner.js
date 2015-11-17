'use strict';

var async = require('async');
var helpers = require('./helpers');

function clean(options, db, done) {
  // check if we received three parameters to keep backwards compatibility
  if (typeof done !== 'function') {
    done = db;
    db = options;
    var msg = '(postgres-cleaner)DEPRECATED: "clean(db, done)" should be ' +
      '"clean(options, db, done)"';
    console.warn(msg);
    return _truncate(db, done);
  }

  if (!options.type) return done(new Error('"type" option is required'));

  switch (options.type) {
  case 'delete':
    return _delete(db, done);
  case 'truncate':
    return _truncate(db, done);
  default:
    return done(new Error('Unrecognized type: ' + options.type));
  }
}

function _delete(db, done) {

  function getAllTables(callback) {
    var query = 'SELECT TABLE_NAME ' +
                'FROM information_schema.tables ' +
                'WHERE table_schema = \'public\';';

    db.query(query, callback);
  }

  function getAllSequences(callback) {
    var query = 'SELECT sequence_name ' +
                'FROM information_schema.sequences;';

    db.query(query, callback);
  }

  function deleteFromTables(callback, results) {
    var tables = results.getAllTables;
    var deleteFromTable = helpers.deleteFromTable.bind(null, db);

    async.each(tables.rows, deleteFromTable, function(err) {
      if (err) return callback(err);

      callback();
    });
  }

  function restartSequences(callback, results) {
    var sequences = results.getAllSequences;
    var restartSeq = helpers.restartSequence.bind(null, db);

    async.each(sequences.rows, restartSeq, function(err) {
      if (err) return callback(err);

      callback();
    });
  }

  async.auto({
    getAllTables: getAllTables,
    getAllSequences: getAllSequences,
    deleteFromTables: ['getAllTables', deleteFromTables],
    restartSequences: ['getAllSequences', restartSequences]
  }, function(err) {
    if (err) return done(err);

    done();
  });
}

function _truncate(db, done) {
  var getAllTables = 'SELECT TABLE_NAME ' +
                     'FROM information_schema.tables ' +
                     'WHERE table_schema = \'public\';';

  db.query(getAllTables, function(err, tables) {
    if (err) return done(err);

    var truncateTable = helpers.truncateTable.bind(null, db);

    async.each(tables.rows, truncateTable, function(err) {
      if (err) return done(err);

      done();
    });
  });
}

module.exports = clean;
