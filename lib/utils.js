'use strict'

const getAllTables = `SELECT TABLE_NAME FROM information_schema.tables
                   WHERE table_schema = 'public'
                   AND table_type = 'BASE TABLE';`

const getAllSequences = `SELECT sequence_name FROM information_schema.sequences
                       WHERE sequence_schema = \'public\';`

const deprecatedMsg = `(postgres-cleaner)DEPRECATED: "clean(db, done)" should
                     be "clean(options, db, done)"`

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

module.exports = {
  queries: {
    getAllTables: getAllTables,
    getAllSequences: getAllSequences,
  },
  deprecatedMsg: deprecatedMsg,
  validOptions: validOptions,
  removeSkipped: removeSkipped,
}
