'use strict'

const async = require('async')
const helpers = require('./helpers')
const utils = require('./utils')

function clean(options, db, done) {
  // check options
  utils.validOptions(options)

  switch (options.type) {
  case 'delete':
    return _delete(options, db, done)
  case 'truncate':
    return _truncate(options, db, done)
  default:
    throw new Error(`Unrecognized type: ${options.type}`)
  }
}

function _delete(options, db, done) {

  function getAllTables(callback) {
    db.query(utils.queries.getAllTables, callback)
  }

  function getAllSequences(callback) {
    db.query(utils.queries.getAllSequences, callback)
  }

  function deleteFromTables(results, callback) {
    const tables = results.getAllTables
    const deleteFromTable = helpers.deleteFromTable.bind(null, db)

    // remove skipped tables from options
    const toDelete = utils.removeSkipped(
      tables.rows,
      'table_name',
      options.skipTables
    )

    async.each(toDelete, deleteFromTable, callback)
  }

  function restartSequences(results, callback) {
    const sequences = results.getAllSequences
    const restartSeq = helpers.restartSequence.bind(null, db)

    // remove skipped sequences from options
    const toDelete = utils.removeSkipped(
      sequences.rows,
      'sequence_name',
      options.skipSequences
    )

    async.each(toDelete, restartSeq, callback)
  }

  async.auto({
    getAllTables: getAllTables,
    getAllSequences: getAllSequences,
    deleteFromTables: ['getAllTables', deleteFromTables],
    restartSequences: ['getAllSequences', restartSequences],
  }, done)
}

function _truncate(options, db, done) {
  db.query(utils.queries.getAllTables, function(err, tables) {
    if (err) return done(err)

    // remove skipped tables from options
    const toDelete = utils.removeSkipped(
      tables.rows,
      'table_name',
      options.skipTables
    )

    // put all tables together so we can truncate all at once
    let truncateMultiple = toDelete.reduce(function(result, table) {
      return `${result}"${table}", `
    }, '')
    truncateMultiple = truncateMultiple.slice(0, -2)

    const q = `TRUNCATE ${truncateMultiple} RESTART IDENTITY CASCADE;`

    return db.query(q, done)
  })
}

module.exports = clean
