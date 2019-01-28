'use strict'

const helpers = require('./helpers')

function clean(options, db) {
  return Promise.resolve()
    .then(function() {
      helpers.validOptions(options)
    })
    .then(function() {
      switch (options.type) {
      case 'delete':
        return _delete(options, db)
      case 'truncate':
        return _truncate(options, db)
      default:
        return Promise.reject(new Error(`Unrecognized type: ${options.type}`))
      }
    })
}

function _delete(options, db) {
  return helpers.getAllTables(db)
    .then(function(tables) {
      const tablesToDelete = helpers.removeSkipped(
        tables.rows,
        'table_name',
        options.skipTables
      )

      const bDelete = helpers.deleteFromTable.bind(null, db)

      return Promise.all(tablesToDelete.map(bDelete))
    })
    .then(function() {
      return helpers.getAllSequences(db)
    })
    .then(function(sequences) {
      // remove skipped tables from options
      const sequencesToRestart = helpers.removeSkipped(
        sequences.rows,
        'sequence_name',
        options.skipSequences
      )

      const bRestart = helpers.restartSequence.bind(null, db)

      return Promise.all(sequencesToRestart.map(bRestart))
    })
}

function _truncate(options, db) {
  return helpers.getAllTables(db)
    .then(function(tables) {
      // remove skipped tables from options
      const toDelete = helpers.removeSkipped(
        tables.rows,
        'table_name',
        options.skipTables
      )

      // put all tables together so we can truncate all at once
      let truncateMultiple = toDelete.reduce(function(result, table) {
        return `${result}"${table}", `
      }, '')
      truncateMultiple = truncateMultiple.slice(0, -2)

      return helpers.truncateTables(db, truncateMultiple)
    })
}

module.exports = clean
