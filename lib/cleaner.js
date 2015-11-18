'use strict';

var async = require('async');
var helpers = require('./helpers');
var utils = require('./utils');

function clean(options, db, done) {
  // check if we received three parameters to keep backwards compatibility
  if (typeof done !== 'function') {
    done = db;
    db = options;
    console.warn(utils.deprecatedMsg);
    return _truncate({ skipTables: [] }, db, done);
  }

  // check options
  utils.validOptions(options);

  switch (options.type) {
  case 'delete':
    return _delete(options, db, done);
  case 'truncate':
    return _truncate(options, db, done);
  default:
    throw new Error('Unrecognized type: ' + options.type);
  }
}

function _delete(options, db, done) {

  function getAllTables(callback) {
    db.query(utils.queries.getAllTables, callback);
  }

  function getAllSequences(callback) {
    db.query(utils.queries.getAllSequences, callback);
  }

  function deleteFromTables(callback, results) {
    var tables = results.getAllTables;
    var deleteFromTable = helpers.deleteFromTable.bind(null, db);

    // remove skipped tables from options
    var toDelete = utils.removeSkipped(
      tables.rows,
      'table_name',
      options.skipTables
    );

    async.each(toDelete, deleteFromTable, callback);
  }

  function restartSequences(callback, results) {
    var sequences = results.getAllSequences;
    var restartSeq = helpers.restartSequence.bind(null, db);

    // remove skipped sequences from options
    var toDelete = utils.removeSkipped(
      sequences.rows,
      'sequence_name',
      options.skipSequences
    );

    async.each(toDelete, restartSeq, callback);
  }

  async.auto({
    getAllTables: getAllTables,
    getAllSequences: getAllSequences,
    deleteFromTables: ['getAllTables', deleteFromTables],
    restartSequences: ['getAllSequences', restartSequences]
  }, done);
}

function _truncate(options, db, done) {
  db.query(utils.queries.getAllTables, function(err, tables) {
    if (err) return done(err);

    var truncateTable = helpers.truncateTable.bind(null, db);

    // remove skipped tables from options
    var toDelete = utils.removeSkipped(
      tables.rows,
      'table_name',
      options.skipTables
    );

    async.each(toDelete, truncateTable, done);
  });
}

module.exports = clean;
