'use strict'

// truncate table and restart indentity
function truncateTables(db, truncateMultiple, callback) {
  const truncateQuery = `TRUNCATE ${truncateMultiple} RESTART IDENTITY CASCADE;`

  return db.query(truncateQuery, callback)
}

function deleteFromTable(db, table, callback) {
  const query = `DELETE FROM "${table}";`

  db.query(query, callback)
}

function restartSequence(db, sequence, callback) {
  const query = `ALTER SEQUENCE "${sequence}" RESTART WITH 1;`

  db.query(query, callback)
}

module.exports = {
  truncateTables: truncateTables,
  deleteFromTable: deleteFromTable,
  restartSequence: restartSequence,
}
