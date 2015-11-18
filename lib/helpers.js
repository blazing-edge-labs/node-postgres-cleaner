'use strict';

// truncate table and restart indentity
function truncateTable(db, table, callback) {
  var truncateQuery = 'TRUNCATE ' + '"' +
    table + '"RESTART IDENTITY;';

  db.query(truncateQuery, callback);
}

function deleteFromTable(db, table, callback) {
  var query = 'DELETE FROM "' + table + '";';

  db.query(query, callback);
}

function restartSequence(db, sequence, callback) {
  var query = 'ALTER SEQUENCE "' + sequence +
    '" RESTART WITH 1;';

  db.query(query, callback);
}

module.exports = {
  truncateTable: truncateTable,
  deleteFromTable: deleteFromTable,
  restartSequence: restartSequence
};
