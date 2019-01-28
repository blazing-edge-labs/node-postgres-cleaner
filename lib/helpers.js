'use strict'

const util = require('util')

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

function getAllTables(db, callback) {
  db.query(_getAllTables, callback)
}

function getAllSequences(db, callback) {
  db.query(_getAllSequences, callback)
}

function truncateTables(db, truncateMultiple, callback) {
  const q = `TRUNCATE ${truncateMultiple} RESTART IDENTITY CASCADE;`

  db.query(q, callback)
}

function deleteFromTable(db, table) {
  return new Promise(function(resolve, reject) {
    const query = `DELETE FROM "${table}";`

    db.query(query, function(err, res) {
      if (err) return reject(err)
      resolve(res)
    })
  })
}

function restartSequence(db, sequence) {
  return new Promise(function(resolve, reject) {
    const query = `ALTER SEQUENCE "${sequence}" RESTART WITH 1;`

    db.query(query, function(err, res) {
      if (err) return reject(err)
      resolve(res)
    })
  })
}

module.exports = {
  getAllTables: util.promisify(getAllTables),
  getAllSequences: util.promisify(getAllSequences),
  validOptions: validOptions,
  removeSkipped: removeSkipped,
  deleteFromTable: deleteFromTable,
  restartSequence: restartSequence,
  truncateTables: util.promisify(truncateTables),
}
