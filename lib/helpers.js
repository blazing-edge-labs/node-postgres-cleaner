'use strict'

// truncate table and restart indentity
function truncateTable(db, table, callback) {
  const truncateQuery = `TRUNCATE "${table}" RESTART IDENTITY CASCADE;`

  db.query(truncateQuery, callback)
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
  truncateTable: truncateTable,
  deleteFromTable: deleteFromTable,
  restartSequence: restartSequence,
}
