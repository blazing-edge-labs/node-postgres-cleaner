'use strict';

// truncate table and restart indentity
function truncateTable(db, table, callback) {
  var truncateQuery = 'TRUNCATE ' + '"' +
    table.table_name + '"RESTART IDENTITY;';

  db.query(truncateQuery, callback);
}

module.exports = {
  truncateTable: truncateTable
};
