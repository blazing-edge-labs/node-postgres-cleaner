'use strict'

const _getAllTables = `SELECT TABLE_NAME FROM information_schema.tables
                   WHERE table_schema = 'public'
                   AND table_type = 'BASE TABLE';`

const _getAllSequences = `SELECT sequence_name FROM information_schema.sequences
                       WHERE sequence_schema = \'public\';`

function _addSequnces(table) {
  return `${table}_id_seq`
}

function validOptions(options) {
  // default to truncate option
  if (!options.type) options.type = 'truncate'

  if (!options.skipTables) options.skipTables = []

  // determine what sequences to skip according to skipped tables
  options.skipSequences = options.skipTables.map(_addSequnces)

  return true
}

function removeSkipped(list, key, skipped) {
  return list.reduce(function(res, el) {
    if (!skipped.includes(el[key])) res.push(el[key])
    return res
  }, [])
}

function getAllTables(db) {
  return db.query(_getAllTables)
}

function getAllSequences(db) {
  return db.query(_getAllSequences)
}

function truncateTables(db, truncateMultiple) {
  const q = `TRUNCATE ${truncateMultiple} RESTART IDENTITY CASCADE;`

  return db.query(q)
}

function deleteFromTable(db, table) {
  return db.query(`DELETE FROM "${table}";`)
}

function restartSequence(db, sequence) {
  return db.query(`ALTER SEQUENCE "${sequence}" RESTART WITH 1;`)
}

module.exports = {
  getAllTables: getAllTables,
  getAllSequences: getAllSequences,
  validOptions: validOptions,
  removeSkipped: removeSkipped,
  deleteFromTable: deleteFromTable,
  restartSequence: restartSequence,
  truncateTables: truncateTables,
}
